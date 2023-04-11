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
import { Role } from "src/company/enum/Role";

interface CompanyCreationAttrs {
  role: Role;
  cui: string;
  name: string;
  email: string;
  password: string;
  location: string;
}

@Table({ tableName: "companies" })
export class Company extends Model<Company, CompanyCreationAttrs> {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  role: Role;

  @AllowNull(false)
  @Column(DataType.STRING)
  location: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  cui: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  street?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  schedule?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  phone?: string;
}
