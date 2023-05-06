import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";
import { CreateRecycleDrugDto } from "src/recycle-drug/dto/create-recycle-drug.dto";
import { CompanyService } from "src/company/company.service";
import { TokenUtils } from "src/utils/token.utils";
import { createPdf } from "@saemhco/nestjs-html-pdf";
import { ProductPack } from "src/expired-products/enum/product-pack";
import { DrugsService } from "src/drugs/drugs.service";
import {
  IDrug,
  IRecycledDrug,
} from "src/recycle-drug/interfaces/drug.interface";
import { Drug } from "src/drugs/drugs.model";
import { Company } from "src/company/company.model";
import { RecycleDrugUtils } from "src/recycle-drug/utils/recycle-drug.utils";
import { CreateRecycleDrugResponse } from "src/recycle-drug/responses/create-recycle-drug-response";

@Injectable()
export class RecycleDrugService {
  constructor(
    @InjectModel(RecycleDrug) private recycleDrugRepository: typeof RecycleDrug,
    private companyService: CompanyService,
    private drugService: DrugsService,
    private tokenUtils: TokenUtils
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
      drugList: recycledDrugList,
    });

    return {
      drugCode: createdDrug.id,
    };
  }

  async getAllDrugByPharmacy(token: string): Promise<RecycleDrug[]> {
    const pharmacyId: number = this.tokenUtils.getCompanyIdFromToken(token);
    const drugList: RecycleDrug[] = await this.recycleDrugRepository.findAll({
      where: { pharmacyId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    return drugList;
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

    const { getPdfFormat, getCurrentDate, getPathTemplate } = RecycleDrugUtils;
    return createPdf(getPathTemplate(), getPdfFormat(), {
      ...drug.toJSON(),
      date: getCurrentDate(),
      drugList,
    });
  }
}
