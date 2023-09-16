import { Op } from "sequelize";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";
import { CreateRecycleDrugDto } from "src/recycle-drug/dto/create-recycle-drug.dto";
import { PharmacyService } from "src/pharmacies/pharmacy.service";
import { DrugsService } from "src/drugs/drugs.service";
import {
  IDrug,
  IRecycledDrug,
} from "src/recycle-drug/interfaces/drug.interface";
import { Drug } from "src/drugs/drugs.model";
import { Pharmacy } from "src/pharmacies/pharmacy.model";
import { CreateRecycleDrugResponse } from "src/recycle-drug/responses/create-recycle-drug-response";
import { MessageResponse } from "src/reponses/message-response";
import { PuppeteerService } from "src/puppeteer/puppetter.service";
import { ProductStatus } from "src/recycle-drug/enum/product-status";
import { ProductPack } from "src/recycle-drug/enum/product-pack";
import { ChainsService } from "src/chains/chains.service";
import { Chain } from "src/chains/chains.model";
import { IVerbalData } from "src/recycle-drug/interfaces/verbal-data.interface";
import { PaginationHelper } from "src/helpers/pagination.helper";

@Injectable()
export class RecycleDrugService {
  constructor(
    @InjectModel(RecycleDrug) private recycleDrugRepository: typeof RecycleDrug,
    private puppeteerService: PuppeteerService,
    private pharmacyService: PharmacyService,
    private chainService: ChainsService,
    private drugService: DrugsService,
    private paginationHelper: PaginationHelper<RecycleDrug>
  ) {}

  async create(dto: CreateRecycleDrugDto): Promise<CreateRecycleDrugResponse> {
    const chain: Chain = await this.chainService.getById(dto.chainId);

    if (!chain) throw new NotFoundException("Chain not found");

    const drugIdList: number[] = dto.drugList.map(
      ({ drugId }: IDrug) => drugId
    );
    const drugList: Drug[] = await this.drugService.getDrugByIdList(drugIdList);

    if (drugList.length !== drugIdList.length)
      throw new NotFoundException("Drug not found");

    const recycledDrugList: IRecycledDrug[] = drugList.map(
      (drugDetails: Drug) => {
        const drug = dto.drugList.find(
          ({ drugId }: IDrug): boolean => drugId === drugDetails.id
        );
        return { ...drug, drugDetails };
      }
    );

    const createdDrug: RecycleDrug = await this.recycleDrugRepository.create({
      ...dto,
      status: ProductStatus.pending,
      drugList: recycledDrugList,
    });

    return {
      drugCode: createdDrug.id,
    };
  }

  async getDrugsByPharmacyId(pharmacyId: number, page: number, limit: number) {
    const pharmacy: Pharmacy = await this.pharmacyService.getById(pharmacyId);

    return this.paginationHelper.paginate({
      page,
      limit,
      options: {
        where: { chainId: pharmacy.chainId },
        attributes: {
          exclude: ["createdAt", "updatedAt", "chainId"],
        },
        order: [["id", "DESC"]],
      },
      model: this.recycleDrugRepository,
    });
  }

  async getFilteredDrugsByName(query: string, pharmacyId: number) {
    const pharmacy: Pharmacy = await this.pharmacyService.getById(pharmacyId);

    let defaultFilterClause: Record<string, Record<string, string>>[] = [
      { firstName: { [Op.iLike]: `%${query}%` } },
      { lastName: { [Op.iLike]: `%${query}%` } },
    ];

    if (Number(query))
      defaultFilterClause = [{ id: { [Op.eq]: Number(query) } }];

    return this.recycleDrugRepository.findAll({
      where: {
        chainId: pharmacy.chainId,
        [Op.or]: defaultFilterClause,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "chainId"],
      },
      limit: 10,
      order: [["id", "DESC"]],
    });
  }

  getEndOfDay(date: string): Date {
    const endOfDay: Date = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  }

  getFilteredDrugsByIsPsycholeptic(
    drugs: RecycleDrug[],
    isPsycholeptic: boolean
  ): RecycleDrug[] {
    const data: RecycleDrug[] = JSON.parse(JSON.stringify(drugs));
    return data
      .map((drug: RecycleDrug): RecycleDrug => {
        const filteredDrugList: IRecycledDrug[] = drug.drugList.filter(
          ({ drugDetails }: IRecycledDrug): boolean =>
            drugDetails.isPsycholeptic === isPsycholeptic
        );
        return { ...drug, drugList: filteredDrugList } as RecycleDrug;
      })
      .filter(({ drugList }: RecycleDrug) => !!drugList.length);
  }

  async getPharmacyDrugsByInterval(
    pharmacyId: number,
    startDate: string,
    endDate: string
  ): Promise<RecycleDrug[]> {
    const pharmacy: Pharmacy = await this.pharmacyService.getById(pharmacyId);
    const drugs: RecycleDrug[] = await this.recycleDrugRepository.findAll({
      where: {
        chainId: pharmacy.chainId,
        status: ProductStatus.recycled,
        createdAt: {
          [Op.between]: [startDate, this.getEndOfDay(endDate)],
        },
      },
      order: [["id", "DESC"]],
    });
    return drugs;
  }

  async getAllDrugsByPharmacy(pharmacyId: number): Promise<IRecycledDrug[]> {
    const drugs: RecycleDrug[] = await this.recycleDrugRepository.findAll({
      where: { chainId: pharmacyId, status: ProductStatus.recycled },
      order: [["id", "DESC"]],
    });

    return [].concat(
      ...drugs.map(({ drugList, createdAt }) =>
        drugList
          .map((item) => ({ ...item, createdAt }))
          .reduce((acc, val) => acc.concat(val), [])
      )
    );
  }

  async updateRecycleDrugStatus(
    id: number,
    pharmacyId: number
  ): Promise<MessageResponse> {
    const drug: RecycleDrug = await this.recycleDrugRepository.findOne({
      where: { chainId: pharmacyId, id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
    });

    if (!drug) throw new NotFoundException("Drug not found");

    await drug.update({ ...drug, status: ProductStatus.recycled });

    return {
      message: "Drug successfully updated!",
    };
  }

  async getVerbalData(id: number): Promise<IVerbalData> {
    const drug: RecycleDrug = await this.recycleDrugRepository.findOne({
      where: { id },
      include: { all: true },
    });

    if (!drug) throw new NotFoundException("Drug not found");

    return {
      drugDetails: drug,
      generationDate: new Date().toISOString().slice(0, 10),
    };
  }

  async getMonthlyAudit(id: number): Promise<any> {
    const pharmacy: Pharmacy = await this.pharmacyService.getById(id);

    const drugList = await this.getDrugsByOneMonthAgo(id);

    const response = await this.puppeteerService.generatePDF(
      "pdf-verbal-process-month.hbs",
      {
        drugList,
        pharmacyName: pharmacy.name,
        date: new Date().toISOString().slice(0, 10),
      }
    );
    return response;
  }

  async getDrugsByOneMonthAgo(pharmacyId: number) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recycleDrugs: RecycleDrug[] =
      await this.recycleDrugRepository.findAll({
        where: {
          chainId: pharmacyId,
          status: ProductStatus.recycled,
          createdAt: {
            [Op.gte]: oneMonthAgo,
          },
        },
      });

    return recycleDrugs
      .map(
        ({
          firstName,
          lastName,
          drugList,
          updatedAt: recycledAt,
        }: RecycleDrug) => {
          const details = { fullName: `${firstName} ${lastName}`, recycledAt };
          return drugList.map(({ pack, ...rest }: IRecycledDrug) => ({
            ...rest,
            ...details,
            pack: pack === ProductPack.pack ? "cutie" : "pastila",
            recycledAt: new Date(recycledAt).toISOString().slice(0, 10),
          }));
        }
      )
      .reduce((acc, val) => acc.concat(val), []);
  }
}
