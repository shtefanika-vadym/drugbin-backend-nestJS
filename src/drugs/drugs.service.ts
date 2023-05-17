import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Drug } from "src/drugs/drugs.model";
import { VisionService } from "src/vision/vision.service";
import { Op } from "sequelize";

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

  async identifyDrugByImage(image: Express.Multer.File): Promise<any> {
    const drugs: Drug[] = await this.drugRepository.findAll();
    const result: string[] = await this.visionService.identifyText(image);

    let bestScore: number = -1;
    let bestDrug: Drug = null;

    drugs.forEach((drug: Drug) => {
      const drugNameList: string[] = drug.name.split(" ");
      const totalCount: number = result.reduce(
        (acc: number, el: string): number => {
          const isCounting: boolean = drug.name
            .toLowerCase()
            .includes(el.toLowerCase());
          return isCounting ? acc + 1 : acc;
        },
        0
      );
      const isContainsAll: boolean = drugNameList.every((item: string) =>
        result.some(
          (el: string): boolean => el.toLowerCase() === item.toLowerCase()
        )
      );
      if (totalCount >= bestScore && isContainsAll) {
        bestScore = totalCount;
        bestDrug = drug;
      }
    });
    return bestDrug;
  }
}
