import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
} from "sequelize-typescript";
import { Company } from "src/company/company.model";
import { ProductStatus } from "src/expired-products/enum/product-status";
import { IsEnum } from "class-validator";
import { DrugStock } from "src/drug-stock/drug-stock.model";
import { ProductPack } from "src/expired-products/enum/product-pack";
import { DrugType } from "src/drug-stock/enum/drug-type";
import { ApiProperty } from "@nestjs/swagger";

interface ExpiredProductCreationAttrs {
  name: string;
  type: DrugType;
  pack: ProductPack;
  status: ProductStatus;
  companyId: number;
  quantity: number;
}

@Table({ tableName: "expired_products" })
export class ExpiredProduct extends Model<
  ExpiredProduct,
  ExpiredProductCreationAttrs
> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.INTEGER)
  quantity: number;

  @ApiProperty()
  @AllowNull(false)
  @IsEnum(DrugType)
  @Column(DataType.ENUM(...Object.values(DrugType)))
  type: DrugType;

  @ApiProperty()
  @AllowNull(false)
  @IsEnum(ProductPack)
  @Column(DataType.ENUM(...Object.values(ProductPack)))
  pack: ProductPack;

  @ApiProperty()
  @AllowNull(false)
  @IsEnum(ProductStatus)
  @Column(DataType.ENUM(...Object.values(ProductStatus)))
  status: ProductStatus;

  @ApiProperty()
  @ForeignKey(() => Company)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  companyId: number;

  @ApiProperty()
  @BelongsTo(() => Company)
  company: Company;

  @ApiProperty()
  @ForeignKey(() => DrugStock)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  drugId: number;

  @ApiProperty()
  @BelongsTo(() => DrugStock)
  drug: DrugStock;
}
