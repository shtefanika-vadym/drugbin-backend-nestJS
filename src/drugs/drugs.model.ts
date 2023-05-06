import {
  Column,
  Model,
  Table,
  DataType,
  AllowNull,
  PrimaryKey,
  AutoIncrement,
  Unique,
} from "sequelize-typescript";

@Table({ tableName: "drugs" })
export class Drug extends Model<Drug> {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  cim: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  dci: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  form: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  concentration: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  firm: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  app: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  atc: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  action: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  prescription: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  packaging: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  packageVolume: string;
}
