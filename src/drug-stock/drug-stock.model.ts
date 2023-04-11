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
import { DrugType } from "src/drug-stock/enum/DrugType";
import { IsEnum } from "class-validator";

interface DrugStockCreationAttrs {
  name: string;
  package: string;
  package_total: number;
  strength?: number;
  type: DrugType;
  barcode: string;
}

@Table({ tableName: "drug-stock" })
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
  package_total: number;

  @Column(DataType.INTEGER)
  strength?: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
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
