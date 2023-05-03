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
import { IDrug } from "src/recycle-drug/interfaces/drug.interface";

interface RecycleDrugCreationAttrs {
  email?: string;
  firstName: string;
  lastName: string;
  drugList: IDrug[];
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

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.JSON))
  drugList: IDrug[];
}
