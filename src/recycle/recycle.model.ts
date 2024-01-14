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
import { IRecycledDrug } from "src/recycle/interfaces/drug.interface";
import { IsEnum } from "class-validator";
import { ProductStatus } from "src/recycle/enum/product-status";
import { Hospital } from "src/hospital/hospital.model";

interface RecycleCreationAttrs {
  cnp?: string;
  email?: string;
  firstName: string;
  lastName: string;
  address?: string;
  recycleId: string;
  status: ProductStatus;
  drugList: IRecycledDrug[];
}

@Table({ tableName: "recycle" })
export class Recycle extends Model<Recycle, RecycleCreationAttrs> {
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
  cnp?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  address?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  recycleId: string;

  @AllowNull(true)
  @IsEnum(ProductStatus)
  @Column(DataType.ENUM(...Object.values(ProductStatus)))
  status: ProductStatus;

  @AllowNull(true)
  @Column(DataType.JSON)
  drugList: IRecycledDrug[];

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Hospital)
  hospitalId: number;

  @BelongsTo(() => Hospital)
  hospital: Hospital;
}
