import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Drug } from "src/drugs/drugs.model";
import { Op } from "sequelize";

@Injectable()
export class DrugsService {
  constructor(@InjectModel(Drug) private drugRepository: typeof Drug) {}

  async getDrugsByName(name: string) {
    const drugs = await this.drugRepository.findAll({
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${name}%` } }],
      },
    });
    return drugs;
  }

  async getDrugByIdList(idList: number[]) {
    const drugList = await this.drugRepository.findAll({
      where: {
        id: idList,
      },
    });
    return drugList;
  }
}
