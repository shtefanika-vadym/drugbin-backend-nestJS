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
import { Status } from "src/expired-products/enum/Status";
import { IsEnum } from "class-validator";

interface ExpiredProductCreationAttrs {
  name: string;
  brand: string;
  type: string;
  pack: string;
  status: Status;
  companyId: number;
  quantity: number;
}

@Table({ tableName: "expired-products" })
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
  @Column(DataType.STRING)
  brand: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  quantity: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  type: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  pack: string;

  @AllowNull(false)
  @IsEnum(Status)
  @Column(DataType.ENUM(...Object.values(Status)))
  status: Status;

  @ForeignKey(() => Company)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;
}
