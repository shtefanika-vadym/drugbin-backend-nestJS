import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { IRecycledDrug } from "src/recycle-drug/interfaces/drug.interface";
import { IsEnum } from "class-validator";
import { ProductStatus } from "src/recycle-drug/enum/product-status";
import { Chain } from "src/chains/chains.model";
import { Pharmacy } from "src/pharmacies/pharmacy.model";

interface RecycleDrugCreationAttrs {
  email?: string;
  firstName: string;
  lastName: string;
  status: ProductStatus;
  drugList: IRecycledDrug[];
}

@Table({ tableName: "recycle_drug" })
export class RecycleDrug extends Model<RecycleDrug, RecycleDrugCreationAttrs> {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  firstName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  lastName: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  email?: string;

  @AllowNull(true)
  @IsEnum(ProductStatus)
  @Column(DataType.ENUM(...Object.values(ProductStatus)))
  status: ProductStatus;

  @AllowNull(true)
  @Column(DataType.JSON)
  drugList: IRecycledDrug[];

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Pharmacy)
  pharmacyId: number;

  @BelongsTo(() => Pharmacy)
  pharmacy: Pharmacy;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Chain)
  chainId: number;

  @BelongsTo(() => Chain)
  chain: Chain;
}
