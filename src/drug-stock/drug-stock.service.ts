import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DrugStock } from "src/drug-stock/drug-stock.model";
import { CreateDrugDto } from "src/drug-stock/dto/create-drug.dto";
import { Op } from "sequelize";
import { DrugType } from "src/drug-stock/enum/drug-type";
import { MessageResponse } from "src/reponses/message-response";

@Injectable()
export class DrugStockService {
  constructor(
    @InjectModel(DrugStock)
    private drugStockRepository: typeof DrugStock
  ) {}

  async create(dto: CreateDrugDto): Promise<MessageResponse> {
    const existingDrug: DrugStock = await this.drugStockRepository.findOne({
      where: { barcode: dto.barcode },
    });
    if (existingDrug)
      throw new ConflictException(
        "A drug.interface.ts with the same code already exists"
      );

    await this.drugStockRepository.create(dto);

    return {
      message: "Thanks! Drug successfully added",
    };
  }

  async filter(type: DrugType, query: string): Promise<DrugStock[]> {
    if (!Object.values(DrugType).includes(type))
      throw new BadRequestException("Invalid query type");

    const drugs: DrugStock[] = await this.drugStockRepository.findAll({
      where: {
        type,
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { barcode: { [Op.iLike]: `%${query}%` } },
        ],
      },
      include: { all: true },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    return drugs;
  }
}
