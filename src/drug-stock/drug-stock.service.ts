import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DrugStock } from "src/drug-stock/drug-stock.model";
import { CreateDrugDto } from "src/drug-stock/dto/create-drug.dto";
import { Op } from "sequelize";
import { DrugType } from "src/drug-stock/enum/drug-type";

@Injectable()
export class DrugStockService {
  constructor(
    @InjectModel(DrugStock)
    private drugStockRepository: typeof DrugStock
  ) {}

  async create(dto: CreateDrugDto) {
    const existingDrug = await this.drugStockRepository.findOne({
      where: { barcode: dto.barcode },
    });
    if (existingDrug) {
      throw new ConflictException("A drug with the same code already exists");
    }

    await this.drugStockRepository.create(dto);

    return {
      message: "Thanks! Drug successfully added",
    };
  }



  async getById(id: number) {
    const drug = await this.drugStockRepository.findByPk(id);
    if (!drug) throw new NotFoundException("Drug found drug");
    return drug;
  }

  async filter(type: DrugType, query: string) {
    if (!Object.values(DrugType).includes(type))
      throw new BadRequestException("Invalid query type");

    const drugs = await this.drugStockRepository.findAll({
      where: {
        type,
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { barcode: { [Op.iLike]: `%${query}%` } },
        ],
      },
      include: { all: true },
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
    });

    return drugs;
  }
}
