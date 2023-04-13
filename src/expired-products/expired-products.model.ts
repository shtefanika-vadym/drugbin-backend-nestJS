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
  @Column(DataType.INTEGER)
  quantity: number;

  @AllowNull(false)
  @IsEnum(DrugType)
  @Column(DataType.ENUM(...Object.values(DrugType)))
  type: DrugType;

  @AllowNull(false)
  @IsEnum(ProductPack)
  @Column(DataType.ENUM(...Object.values(ProductPack)))
  pack: ProductPack;

  @AllowNull(false)
  @IsEnum(ProductStatus)
  @Column(DataType.ENUM(...Object.values(ProductStatus)))
  status: ProductStatus;

  @ForeignKey(() => Company)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @ForeignKey(() => DrugStock)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  drugId: number;

  @BelongsTo(() => DrugStock)
  drug: DrugStock;
}
