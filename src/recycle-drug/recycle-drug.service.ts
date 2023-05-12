import { Op } from "sequelize";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";
import { CreateRecycleDrugDto } from "src/recycle-drug/dto/create-recycle-drug.dto";
import { CompanyService } from "src/company/company.service";
import { DrugsService } from "src/drugs/drugs.service";
import {
  IDrug,
  IRecycledDrug,
} from "src/recycle-drug/interfaces/drug.interface";
import { Drug } from "src/drugs/drugs.model";
import { Company } from "src/company/company.model";
import { CreateRecycleDrugResponse } from "src/recycle-drug/responses/create-recycle-drug-response";
import { MessageResponse } from "src/reponses/message-response";
import { PuppeteerService } from "src/puppeteer/puppetter.service";
import { ProductStatus } from "src/drug-stock/enum/product-status";
import { ProductPack } from "src/drug-stock/enum/product-pack";

@Injectable()
export class RecycleDrugService {
  constructor(
    @InjectModel(RecycleDrug) private recycleDrugRepository: typeof RecycleDrug,
    private puppeteerService: PuppeteerService,
    private companyService: CompanyService,
    private drugService: DrugsService
  ) {}

  async create(dto: CreateRecycleDrugDto): Promise<CreateRecycleDrugResponse> {
    const pharmacy: Company = await this.companyService.getPharmacyById(
      dto.pharmacyId
    );

    if (!pharmacy) throw new NotFoundException("Pharmacy not found");

    const drugIdList: number[] = dto.drugList.map(
      ({ drugId }: IDrug) => drugId
    );
    const drugList: Drug[] = await this.drugService.getDrugByIdList(drugIdList);

    if (drugList.length !== drugIdList.length)
      throw new Error("Drug not found");

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

  async getAllDrugByPharmacy(pharmacyId: number): Promise<RecycleDrug[]> {
    return this.recycleDrugRepository.findAll({
      where: { pharmacyId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
    });
  }

  async updateRecycleDrugStatus(
    id: number,
    pharmacyId: number
  ): Promise<MessageResponse> {
    const drug: RecycleDrug = await this.recycleDrugRepository.findOne({
      where: { pharmacyId, id },
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

  async getVerbalProcess(id: number): Promise<any> {
    const drug: RecycleDrug = await this.recycleDrugRepository.findOne({
      where: { id },
      include: { all: true },
    });

    if (!drug) throw new NotFoundException("Drug not found");

    const drugList = drug.drugList.map(({ pack, ...rest }: IRecycledDrug) => ({
      ...rest,
      pack: pack === ProductPack.pack ? "cutie" : "pastila",
    }));

    const response = await this.puppeteerService.generatePDF(
      "pdf-verbal-process.hbs",
      {
        ...drug.toJSON(),
        drugList,
        date: new Date().toISOString().slice(0, 10),
      }
    );
    return response;
  }

  // Need refactoring after MVP
  async getMonthlyAudit(id: number): Promise<any> {
    const pharmacy: Company = await this.companyService.getPharmacyById(id);

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

    const recycleDrugs: RecycleDrug[] = await this.recycleDrugRepository.findAll(
      {
        where: {
          pharmacyId,
          status: ProductStatus.recycled,
          createdAt: {
            [Op.gte]: oneMonthAgo,
          },
        },
      }
    );

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
