import { Op, QueryTypes } from "sequelize";
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
import { IPagination } from "src/helpers/pagination.interface";
import * as moment from "moment";
import { v4 as uuidv4 } from "uuid";

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
      recycleId: uuidv4(),
      status: ProductStatus.pending,
      drugList: recycledDrugList,
    });

    return {
      recycleId: createdDrug.recycleId,
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

  async getFilteredDrugsByName(
    query: string,
    pharmacyId: number,
    page: number,
    limit: number
  ): Promise<IPagination<RecycleDrug[]>> {
    const pharmacy: Pharmacy = await this.pharmacyService.getById(pharmacyId);

    let defaultFilterClause: Record<string, Record<string, string>>[] = [
      { firstName: { [Op.iLike]: `%${query}%` } },
      { lastName: { [Op.iLike]: `%${query}%` } },
    ];

    if (Number(query))
      defaultFilterClause = [{ id: { [Op.eq]: Number(query) } }];

    return this.paginationHelper.paginate({
      page,
      limit,
      options: {
        where: {
          chainId: pharmacy.chainId,
          [Op.or]: defaultFilterClause,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "chainId"],
        },
        order: [["id", "DESC"]],
      },
      model: this.recycleDrugRepository,
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

  getLastRecycledDrug(pharmacyId: number): Promise<RecycleDrug> {
    return this.recycleDrugRepository.findOne({
      where: { chainId: pharmacyId, status: ProductStatus.recycled },
      order: [["id", "DESC"]],
    });
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

  async getAllDrugsByPharmacy(
    pharmacyId: number,
    page: number,
    limit: number
  ): Promise<IPagination<IRecycledDrug[]>> {
    const offset = (page - 1) * limit;
    const [{ sum: totalItems }]: { sum: number }[] =
      await this.recycleDrugRepository.sequelize.query(
        'SELECT SUM(json_array_length("drugList")) FROM "recycle_drug" WHERE "chainId" = :chainId AND "status" = :status',
        {
          replacements: { chainId: pharmacyId, status: ProductStatus.recycled },
          type: QueryTypes.SELECT,
        }
      );
    const data: { json_array_elements: IRecycledDrug }[] =
      await this.recycleDrugRepository.sequelize.query(
        'SELECT "createdAt", json_array_elements("drugList") FROM "recycle_drug" WHERE "chainId" = :chainId AND "status" = :status ORDER BY "id" DESC LIMIT :limit OFFSET :offset',
        {
          replacements: {
            chainId: pharmacyId,
            status: ProductStatus.recycled,
            limit,
            offset,
          },
          type: QueryTypes.SELECT,
        }
      );

    return { data: this.replaceJsonResultKey(data), limit, page, totalItems };
  }

  replaceJsonResultKey(
    data: { createdAt?: string; json_array_elements: IRecycledDrug }[]
  ): IRecycledDrug[] {
    return data.map(({ json_array_elements, createdAt }) => ({
      ...json_array_elements,
      createdAt,
    }));
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

  async getDrugListByYear(pharmacyId: number, year: string): Promise<any> {
    const data: { json_array_elements: IRecycledDrug }[] =
      await this.recycleDrugRepository.sequelize.query(
        'SELECT "createdAt", json_array_elements("drugList") FROM "recycle_drug" WHERE "pharmacyId" = :pharmacyId AND EXTRACT(YEAR FROM "createdAt") = :year',
        {
          replacements: {
            year,
            pharmacyId,
          },
          type: QueryTypes.SELECT,
        }
      );
    return this.replaceJsonResultKey(data);
  }

  countDrugListItems(drugList: IRecycledDrug[]): number {
    return drugList.reduce((acc: number) => acc + 1, 0);
  }

  countMonthlyDrugListItems(
    drugList: Record<string, IRecycledDrug[]>
  ): Record<string, number> {
    const monthlyCounts: Record<string, number> = {};

    for (const month in drugList) {
      if (drugList.hasOwnProperty(month)) {
        monthlyCounts[month] = drugList[month].length;
      }
    }

    return monthlyCounts;
  }

  getMonthlyTopProducers(drugList: Record<string, IRecycledDrug[]>) {
    const producers: Record<string, any> = {};

    for (const month in drugList) {
      if (drugList.hasOwnProperty(month)) {
        producers[month] = this.getTopProducers(drugList[month]);
      }
    }

    return producers;
  }

  getMonthlyTopTypes(drugList: Record<string, IRecycledDrug[]>) {
    const types: Record<string, any> = {};

    for (const month in drugList) {
      if (drugList.hasOwnProperty(month)) {
        types[month] = this.getTopTypes(drugList[month]);
      }
    }

    return types;
  }

  getTopProducers(data: IRecycledDrug[]): any {
    const producers: Record<string, number> = {};
    data.forEach(({ drugDetails }: IRecycledDrug): void => {
      const { producer } = drugDetails;
      if (!producer) return;
      if (producers.hasOwnProperty(producer)) {
        producers[producer] += 1;
      } else {
        producers[producer] = 1;
      }
    });

    const producerArray = Object.entries(producers).map(
      ([producer, total]) => ({ producer, total })
    );

    producerArray.sort((a, b) => b.total - a.total);

    const top3Producers = producerArray.slice(0, 3);

    return top3Producers;
  }

  getTopTypes(data: IRecycledDrug[]): any {
    const rxPrefixes: string[] = ["PRF", "PR"];
    const types: Record<string, number> = {};
    data.forEach(({ drugDetails }: IRecycledDrug) => {
      const { prescription } = drugDetails;
      if (!prescription) {
        types["Supplement"] = (types["Supplement"] || 0) + 1;
        return;
      }

      if (rxPrefixes.includes(prescription)) {
        types["Rx"] = (types["Rx"] || 0) + 1;
        return;
      }

      types[prescription] = (types[prescription] || 0) + 1;
    });

    const producerArray = Object.entries(types).map(([type, total]) => ({
      type,
      total,
    }));

    producerArray.sort((a, b) => b.total - a.total);

    const top3Producers = producerArray.slice(0, 3);

    return top3Producers;
  }

  splitDashboardDataByMonths(
    data: IRecycledDrug[]
  ): Record<string, IRecycledDrug[]> {
    const groupedByMonth: Record<string, IRecycledDrug[]> = {};

    for (let i: number = 1; i <= 12; i++) {
      groupedByMonth[i] = [];
    }

    data.forEach((item: any): void => {
      const expirationDate: moment.Moment = moment(item.createdAt);
      const monthYearKey: string = expirationDate.format("MM");

      if (!groupedByMonth[Number(monthYearKey)]) {
        groupedByMonth[Number(monthYearKey)] = [];
      }

      groupedByMonth[Number(monthYearKey)].push(item);
    });

    return groupedByMonth;
  }

  async geDashboardDataByYear(pharmacyId: number, year: string): Promise<any> {
    const data: IRecycledDrug[] = await this.getDrugListByYear(
      pharmacyId,
      year
    );

    const groupedByMonth: Record<number, IRecycledDrug[]> =
      this.splitDashboardDataByMonths(data);

    const annualTotalDrugs: number = this.countDrugListItems(data);
    const annualTopProducers = this.getTopProducers(data);
    const annualTopTypes = this.getTopTypes(data);

    const monthlyTotalDrugs: Record<string, number> =
      this.countMonthlyDrugListItems(groupedByMonth);
    const monthlyTopTypes: any = this.getMonthlyTopTypes(groupedByMonth);
    const monthlyTopProducers: any =
      this.getMonthlyTopProducers(groupedByMonth);

    return {
      topTypes: { annualTopTypes, monthlyTopTypes },
      totalDrugs: { annualTotalDrugs, monthlyTotalDrugs },
      topProducers: { annualTopProducers, monthlyTopProducers },
    };
  }
}
