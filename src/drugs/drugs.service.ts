import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Drug } from "src/drugs/drugs.model";
import { VisionService } from "src/vision/vision.service";
import { Op } from "sequelize";
import { DrugsUtils } from "src/drugs/utils/drugs.utils";

@Injectable()
export class DrugsService {
  constructor(
    @InjectModel(Drug) private drugRepository: typeof Drug,
    private visionService: VisionService
  ) {}

  getDrugsByName(name: string): Promise<Drug[]> {
    if (!name)
      return this.drugRepository.findAll({
        limit: 10,
      });

    return this.drugRepository.findAll({
      limit: 10,
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${name}%` } }],
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

  async identifyDrugByImage(image: Express.Multer.File): Promise<Drug[]> {
    const drugs: Drug[] = await this.drugRepository.findAll();
    const textList: string[][] = await this.visionService.identifyText(image);

    const identifiedDrugs: Drug[] = [];

    console.log(textList);

    textList.forEach((drugDetailsList: string[]): void => {
      let bestScore: number = -1;
      let bestDrug: Drug = null;

      drugs.forEach((drug: Drug): void => {
        const drugPackageList: string[] = drug.packaging.match(/\d+/g) || [];

        const drugConcentration: string[] = drug.concentration
          .split(/[ /-]/)
          .map((str: string) => str.replace(/(\d+)\s*(\D+)/i, "$1 $2"));

        const nameWithConcentration = (
          drug.name +
          " " +
          drugConcentration
        ).toLowerCase();

        const drugNameWithConcentration: string[] = nameWithConcentration.split(
          /[ /-]/
        );

        const uniqueDrugNameList: string[] = [
          ...new Set(drugNameWithConcentration),
        ];

        const packageTotal: number = drugPackageList
          .map(Number)
          .reduce((acc: number, el: number) => acc * el, 1);

        let totalCount: number = drugDetailsList.reduce(
          (acc: number, el: string): number => {
            const isCounting: boolean = nameWithConcentration.includes(el);
            return isCounting ? acc + 1 : acc;
          },
          0
        );

        const isSamePackage: boolean = drugDetailsList.some(
          (drugDetails: string) => {
            return (
              drugDetails.split(" ").length === 2 &&
              !drugDetails.includes("mg") &&
              drugDetails.includes(String(packageTotal))
            );
          }
        );

        const isContainsAll: boolean = uniqueDrugNameList.every(
          (item: string) =>
            drugDetailsList.some((el: string): boolean => {
              if (item === "&") return true;
              return el.includes(item);
            })
        );

        // if (
        //   nameWithConcentration.includes("biofen") &&
        //   nameWithConcentration.includes("200")
        // ) {
        //   console.log(
        //     drugDetailsList,
        //     isSamePackage,
        //     isContainsAll,
        //     packageTotal
        //   );
        // }

        if (totalCount >= bestScore && isSamePackage && isContainsAll) {
          bestScore = totalCount;
          bestDrug = drug;
        }
      });

      const isAlreadyExisted: boolean = identifiedDrugs.some(
        (drug: Drug): boolean => drug.id === bestDrug.id
      );

      if (bestDrug && !isAlreadyExisted) identifiedDrugs.push(bestDrug);
    });
    return identifiedDrugs;
  }
}
