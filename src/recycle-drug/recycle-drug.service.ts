import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";
import { CreateRecycleDrugDto } from "src/recycle-drug/dto/create-recycle-drug.dto";

@Injectable()
export class RecycleDrugService {
  constructor(
    @InjectModel(RecycleDrug) private recycleDrugRepository: typeof RecycleDrug
  ) {}

  async create(dto: CreateRecycleDrugDto) {
    const createdDrug = await this.recycleDrugRepository.create(dto);
    return {
      drugCode: createdDrug.id,
    };
  }
  async getAll() {
    const drugList = await this.recycleDrugRepository.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    return drugList;
  }
}
