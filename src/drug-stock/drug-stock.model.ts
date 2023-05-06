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
import { ApiProperty } from "@nestjs/swagger";

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
  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  package: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.INTEGER)
  packageTotal: number;

  @ApiProperty()
  @Column(DataType.INTEGER)
  strength?: number;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.DECIMAL)
  weight: number;

  @ApiProperty()
  @AllowNull(false)
  @IsEnum(DrugType)
  @Column(DataType.ENUM(...Object.values(DrugType)))
  type: DrugType;

  @ApiProperty()
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  barcode: number;
}
