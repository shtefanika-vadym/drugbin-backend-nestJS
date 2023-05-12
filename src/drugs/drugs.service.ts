import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Drug } from "src/drugs/drugs.model";
import { Op } from "sequelize";

@Injectable()
export class DrugsService {
  constructor(@InjectModel(Drug) private drugRepository: typeof Drug) {}

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
}
