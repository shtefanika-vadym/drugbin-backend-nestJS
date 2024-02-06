// TODO: Refactor
import { Op, QueryTypes } from "sequelize";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Recycle } from "src/recycle/recycle.model";
import { CreateRecycleDto } from "src/recycle/dto/create-recycle.dto";
import { HospitalService } from "src/hospital/hospital.service";
import { DrugService } from "src/drug/drug.service";
import { IDrug, IRecycledDrug } from "src/recycle/interfaces/drug.interface";
import { Drug } from "src/drug/drug.model";
import { Hospital } from "src/hospital/hospital.model";
import { CreateRecycleResponse } from "src/recycle/responses/create-recycle-response";
import { MessageResponse } from "src/reponses/message-response";
import { PuppeteerService } from "src/puppeteer/puppetter.service";
import { ProductStatus } from "src/recycle/enum/product-status";
import { Document } from "src/documents/documents.model";
import { ProductPack } from "src/recycle/enum/product-pack";
import { PaginationHelper } from "src/helpers/pagination.helper";
import { IPagination } from "src/helpers/pagination.interface";
import * as moment from "moment";

import { v4 as uuidv4 } from "uuid";
import { DocumentType } from "src/documents/enum/document-type";

@Injectable()
export class RecycleService {
  constructor(
    @InjectModel(Recycle) private recycleDrugRepository: typeof Recycle,
    @InjectModel(Document) private documentRepository: typeof Document,
    private puppeteerService: PuppeteerService,
    private hospitalService: HospitalService,
    private drugService: DrugService,
    private paginationHelper: PaginationHelper<Recycle>
  ) {}

  async create(dto: CreateRecycleDto): Promise<CreateRecycleResponse> {
    const hospital: Hospital = await this.hospitalService.getById(
      dto.hospitalId
    );

    if (!hospital) throw new NotFoundException("Hospital not found");

    const drugIdList: number[] = dto.drugList.map(
      ({ drugId }: IDrug) => drugId
    );

    const drugIdMap: Map<number, number> = new Map();

    for (const drugId of drugIdList) {
      if (drugIdMap.has(drugId)) {
        drugIdMap.set(drugId, drugIdMap.get(drugId)! + 1);
      } else {
        drugIdMap.set(drugId, 1);
      }
    }

    const promises: Promise<Drug[]>[] = [];
    drugIdMap.forEach((count: number, id: number) => {
      const requests = Array(count)
        .fill(id)
        .map((id) => this.drugService.getDrugByIdList([id]));
      promises.push(...requests);
    });

    try {
      const results = await Promise.all(promises);
      const drugList = results.flat();
      if (drugList.length !== drugIdList.length) {
        throw new NotFoundException("Drug not found");
      }

      const recycledDrugList: IRecycledDrug[] = drugList.map(
        (drugDetails: Drug) => {
          const drug = dto.drugList.find(
            ({ drugId }: IDrug): boolean => drugId === drugDetails.id
          );
          return { ...drug, drugDetails };
        }
      );

      const createdDrug: Recycle = await this.recycleDrugRepository.create({
        ...dto,
        recycleId: uuidv4(),
        status: ProductStatus.pending,
        drugList: recycledDrugList,
      });

      return {
        recycleId: createdDrug.recycleId,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteById(
    hospitalId: number,
    recycleId: string
  ): Promise<MessageResponse> {
    const status: number = await this.recycleDrugRepository.destroy({
      where: { recycleId, hospitalId },
    });

    if (status === 0) {
      throw new NotFoundException({
        message: "Recycle not found",
      });
    }

    return { message: "Recycle successfully deleted" };
  }

  async getDrugsByHospitalId(hospitalId: number, page: number, limit: number) {
    const hospital: Hospital = await this.hospitalService.getById(hospitalId);

    return this.paginationHelper.paginate({
      page,
      limit,
      options: {
        where: { hospitalId: hospital.id },
        attributes: {
          exclude: ["updatedAt", "hospitalId"],
        },
        order: [["id", "DESC"]],
      },
      model: this.recycleDrugRepository,
    });
  }

  async getFilteredDrugsByName(
    query: string,
    hospitalId: number,
    page: number,
    limit: number
  ): Promise<IPagination<Recycle[]>> {
    const pharmacy: Hospital = await this.hospitalService.getById(hospitalId);

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
          hospitalId: pharmacy.id,
          [Op.or]: defaultFilterClause,
        },
        attributes: {
          exclude: ["updatedAt", "chainId"],
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
    drugs: Recycle[],
    isPsycholeptic: boolean
  ): Recycle[] {
    const data: Recycle[] = JSON.parse(JSON.stringify(drugs));
    return data
      .map((drug: Recycle): Recycle => {
        const filteredDrugList: IRecycledDrug[] = drug.drugList.filter(
          ({ drugDetails }: IRecycledDrug): boolean =>
            drugDetails.isPsycholeptic === isPsycholeptic
        );
        return { ...drug, drugList: filteredDrugList } as Recycle;
      })
      .filter(({ drugList }: Recycle) => !!drugList.length);
  }

  getLastRecycledDrug(hospitalId: number): Promise<Recycle> {
    return this.recycleDrugRepository.findOne({
      where: { hospitalId: hospitalId, status: ProductStatus.recycled },
      order: [["id", "DESC"]],
    });
  }

  async getHospitalDrugsByInterval(
    hospitalId: number,
    startDate: string,
    endDate: string
  ): Promise<Recycle[]> {
    const pharmacy: Hospital = await this.hospitalService.getById(hospitalId);
    const drugs: Recycle[] = await this.recycleDrugRepository.findAll({
      where: {
        hospitalId: pharmacy.id,
        status: ProductStatus.recycled,
        createdAt: {
          [Op.between]: [startDate, this.getEndOfDay(endDate)],
        },
      },
      include: { all: true },
      order: [["id", "DESC"]],
    });
    return drugs;
  }

  async getAllDrugsByPharmacy(
    hospitalId: number,
    page: number,
    limit: number
  ): Promise<IPagination<IRecycledDrug[]>> {
    const offset = (page - 1) * limit;
    const [{ sum: totalItems }]: { sum: number }[] =
      await this.recycleDrugRepository.sequelize.query(
        'SELECT SUM(json_array_length("drugList")) FROM "recycle_drug" WHERE "chainId" = :chainId AND "status" = :status',
        {
          replacements: {
            hospitalId: hospitalId,
            status: ProductStatus.recycled,
          },
          type: QueryTypes.SELECT,
        }
      );
    const data: { json_array_elements: IRecycledDrug }[] =
      await this.recycleDrugRepository.sequelize.query(
        'SELECT "createdAt", json_array_elements("drugList") FROM "recycle_drug" WHERE "chainId" = :chainId AND "status" = :status ORDER BY "id" DESC LIMIT :limit OFFSET :offset',
        {
          replacements: {
            hospitalId: hospitalId,
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
    hospitalId: number
  ): Promise<MessageResponse> {
    const drug: Recycle = await this.recycleDrugRepository.findOne({
      where: { hospitalId: hospitalId, recycleId: id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
    });

    if (!drug) throw new NotFoundException("Drug not found");

    await drug.update({ ...drug, status: ProductStatus.approved });

    return {
      message: "Drug successfully updated!",
    };
  }

  async getVerbalData(id: string): Promise<Recycle> {
    const recycle: Recycle = await this.recycleDrugRepository.findOne({
      where: { recycleId: id },
      include: { all: true },
    });

    if (!recycle) throw new NotFoundException("Recycle not found");

    return recycle;
  }

  async getMonthlyAudit(id: number): Promise<any> {
    const hospital: Hospital = await this.hospitalService.getById(id);
    const drugList = await this.getDrugsByOneMonthAgo(id);

    const response = await this.puppeteerService.generatePDF(
      "pdf-verbal-process-month.hbs",
      {
        drugList,
        pharmacyName: hospital.name,
        date: new Date().toISOString().slice(0, 10),
      }
    );
    return response;
  }

  async getDrugsByOneMonthAgo(hospitalId: number) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recycleDrugs: Recycle[] = await this.recycleDrugRepository.findAll({
      where: {
        hospitalId: hospitalId,
        status: ProductStatus.recycled,
        createdAt: {
          [Op.gte]: oneMonthAgo,
        },
      },
    });

    return recycleDrugs
      .map(
        ({ firstName, lastName, drugList, updatedAt: recycledAt }: Recycle) => {
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

  async getDrugListByYear(hospitalId: number, year: string): Promise<any> {
    const data: { json_array_elements: IRecycledDrug }[] =
      await this.recycleDrugRepository.sequelize.query(
        'SELECT "createdAt", json_array_elements("drugList") FROM "recycle" WHERE "hospitalId" = :hospitalId AND EXTRACT(YEAR FROM "createdAt") = :year',
        {
          replacements: {
            year,
            hospitalId,
          },
          type: QueryTypes.SELECT,
        }
      );
    return this.replaceJsonResultKey(data);
  }

  countDrugListItems(drugList: IRecycledDrug[]): number {
    return drugList.reduce((acc: number) => acc + 1, 0);
  }

  countMonthlyItems<T>(list: Record<string, T[]>): Record<string, number> {
    const monthlyCounts: Record<string, number> = {};

    for (const month in list) {
      if (list.hasOwnProperty(month)) {
        monthlyCounts[month] = list[month].length;
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

  getAnnualDocuments(hospitalId: number, year: string, documentType: string) {
    return this.documentRepository.sequelize.query(
      'SELECT * FROM "document" WHERE "hospitalId" = :hospitalId AND "documentType" = :documentType AND EXTRACT(YEAR FROM "createdAt") = :year',
      {
        replacements: {
          year,
          hospitalId,
          documentType,
        },
        type: QueryTypes.SELECT,
      }
    );
  }

  splitDashboardDataByMonths<T>(data: T[]): Record<string, T[]> {
    const groupedByMonth: Record<string, T[]> = {};

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
  splitDashboardDataByMonthsAndDays<T>(
    data: T[]
  ): Record<string, Record<string, number>> {
    const groupedByMonthAndDay: Record<string, Record<string, number>> = {};

    data.forEach((item: any): void => {
      const expirationDate: moment.Moment = moment(item.createdAt);
      const monthYearKey: string = expirationDate.format("MM");
      const dayKey: string = expirationDate.format("DD");

      if (!groupedByMonthAndDay[monthYearKey]) {
        groupedByMonthAndDay[monthYearKey] = {};
      }

      if (!groupedByMonthAndDay[monthYearKey][dayKey]) {
        groupedByMonthAndDay[monthYearKey][dayKey] = 0;
      }

      groupedByMonthAndDay[monthYearKey][dayKey]++;
    });

    return groupedByMonthAndDay;
  }
  async geDashboardDataByYear(hospitalId: number, year: string): Promise<any> {
    const data: IRecycledDrug[] = await this.getDrugListByYear(
      hospitalId,
      year
    );

    const groupedByMonth: Record<number, IRecycledDrug[]> =
      this.splitDashboardDataByMonths(data);

    const annualTotalDrugs: number = this.countDrugListItems(data);
    // const annualTopProducers = this.getTopProducers(data);
    const annualTopTypes = this.getTopTypes(data);

    const monthlyTotalDrugs: Record<string, number> =
      this.countMonthlyItems(groupedByMonth);
    const monthlyTopTypes = this.getMonthlyTopTypes(groupedByMonth);
    // const monthlyDocuments = this.getMonthlyTopProducers(groupedByMonth);
    const monthlyTopProducers = this.getMonthlyTopProducers(groupedByMonth);

    const [normal, psycholeptic] = await Promise.all([
      this.getAnnualDocuments(hospitalId, year, DocumentType.normal),
      this.getAnnualDocuments(hospitalId, year, DocumentType.psycholeptic),
    ]);
    const groupedByMonthAndDay: Record<
      string,
      Record<string, number>
    > = this.splitDashboardDataByMonthsAndDays(data);

    return {
      types: {
        annual: annualTopTypes,
        monthly: monthlyTopTypes,
      },
      drugs: {
        annual: annualTotalDrugs,
        monthly: monthlyTotalDrugs,
        monthlyDetails: groupedByMonthAndDay,
      },
      documents: {
        annual: {
          normal: normal.length,
          psycholeptic: psycholeptic.length,
          total: normal.length + psycholeptic.length,
        },
        monthly: {
          normal: this.countMonthlyItems(
            this.splitDashboardDataByMonths(normal)
          ),
          psycholeptic: this.countMonthlyItems(
            this.splitDashboardDataByMonths(psycholeptic)
          ),
        },
      },
      // topProducers: { annualTopProducers, monthlyTopProducers },
    };
  }
}
