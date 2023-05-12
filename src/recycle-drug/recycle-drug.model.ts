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
import { Company } from "src/company/company.model";
import { IsEnum } from "class-validator";
import { ProductStatus } from "src/drug-stock/enum/product-status";

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
  @ForeignKey(() => Company)
  pharmacyId: number;

  @BelongsTo(() => Company)
  pharmacy: Company;
}
