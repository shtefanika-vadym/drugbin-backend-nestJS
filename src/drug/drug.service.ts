import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Drug } from "src/drug/drug.model";
import { VisionService } from "src/vision/vision.service";
import { Op } from "sequelize";
import { DrugPillsType } from "src/drug/enum/drug-pills-type";
import axios from "axios";

@Injectable()
export class DrugService {
  constructor(
    @InjectModel(Drug) private drugRepository: typeof Drug,
    private visionService: VisionService
  ) {}

  getDrugsByName(name: string, limit: number): Promise<Drug[]> {
    if (!name)
      return this.drugRepository.findAll({
        limit: limit,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

    return this.drugRepository.findAll({
      limit: 10,
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${name}%` } }],
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
  }

  getDrugByIdList(idList: number[]): Promise<Drug[]> {
    return this.drugRepository.findAll({
      where: {
        id: idList,
      },
    });
  }

  getDrugPackageDetails(drugDetailsList: string[], pack: string) {
    const drugPackageList: string[] = pack.match(/\d+/g) || [];

    const hasPackage: boolean = drugDetailsList.some(
      (details: string): boolean =>
        details.includes(DrugPillsType.pills) ||
        details.includes(DrugPillsType.packets) ||
        details.includes(DrugPillsType.capsules)
    );

    // const drugPackList: string[] = DrugsUtils.getDrugPack(pack);

    // console.log(pack);

    let packageTotal: number = drugPackageList
      .map(Number)
      .reduce((acc: number, el: number) => acc * el, 1);

    const isSamePackage: boolean = drugDetailsList.some(
      (drugDetails: string) => {
        return (
          drugDetails.split(" ").length === 2 &&
          !drugDetails.includes(DrugPillsType.mg) &&
          drugDetails.includes(String(packageTotal))
        );
      }
    );

    return { hasPackage: false, packageTotal, isSamePackage };
  }

  async identifyDrugByImage(image: Express.Multer.File): Promise<Drug[]> {
    const textList: any[] = await this.visionService.identifyText(image);
    return textList;
  }
}
