import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
} from "sequelize-typescript";
import { DrugType } from "src/drug-stock/enum/drug-type";
import { IsEnum } from "class-validator";

interface DrugStockCreationAttrs {
  name: string;
  package: string;
  packageTotal: number;
  strength?: number;
  type: DrugType;
  barcode: string;
}

@Table({ tableName: "drug_stock" })
export class DrugStock extends Model<DrugStock, DrugStockCreationAttrs> {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  package: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  packageTotal: number;

  @Column(DataType.INTEGER)
  strength?: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL)
  weight: number;

  @AllowNull(false)
  @IsEnum(DrugType)
  @Column(DataType.ENUM(...Object.values(DrugType)))
  type: DrugType;
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  barcode: number;
}
