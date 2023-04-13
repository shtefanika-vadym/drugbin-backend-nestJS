import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DrugStock } from "src/drug-stock/drug-stock.model";
import { CreateDrugDto } from "src/drug-stock/dto/create-drug.dto";
import { Op } from "sequelize";

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

  async filter(query: string) {
    const drugs = await this.drugStockRepository.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { barcode: { [Op.iLike]: `%${query}%` } },
        ],
      },
      include: { all: true },
      attributes: [
        "name",
        "package",
        "package_total",
        "strength",
        "weight",
        "type",
        "barcode",
      ],
    });

    return drugs;
  }
}
