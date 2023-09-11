import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Chain } from "src/chains/chains.model";

@Injectable()
export class ChainsService {
  constructor(@InjectModel(Chain) private chainRepository: typeof Chain) {}

  async getAll(): Promise<Chain[]> {
    return this.chainRepository.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
  }

  async getById(id: number): Promise<Chain> {
    return this.chainRepository.findByPk(id);
  }
}
