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
import { ApiProperty } from "@nestjs/swagger";

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
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  password: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  role: Role;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  location: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  cui: string;

  @ApiProperty()
  @AllowNull(true)
  @Column(DataType.STRING)
  street?: string;

  @ApiProperty()
  @AllowNull(true)
  @Column(DataType.STRING)
  schedule?: string;

  @ApiProperty()
  @AllowNull(true)
  @Column(DataType.STRING)
  phone?: string;

  @ApiProperty()
  @AllowNull(true)
  @Column(DataType.DECIMAL)
  weight?: number;

  @ApiProperty()
  @AllowNull(true)
  @Column(DataType.DECIMAL)
  weightRx?: number;

  @ApiProperty()
  @AllowNull(true)
  @Column(DataType.DECIMAL)
  weightOtc?: number;

  @ApiProperty()
  @AllowNull(true)
  @Column(DataType.DECIMAL)
  weightSupplement?: number;
}
