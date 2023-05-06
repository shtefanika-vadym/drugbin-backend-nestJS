import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Drug } from "src/drugs/drugs.model";
import { Op } from "sequelize";

@Injectable()
export class DrugsService {
  constructor(@InjectModel(Drug) private drugRepository: typeof Drug) {}

  async getDrugsByName(name: string): Promise<Drug[]> {
    const drugs: Drug[] = await this.drugRepository.findAll({
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${name}%` } }],
      },
    });
    return drugs;
  }

  async getDrugByIdList(idList: number[]): Promise<Drug[]> {
    const drugList: Drug[] = await this.drugRepository.findAll({
      where: {
        id: idList,
      },
    });
    return drugList;
  }
}
