import { Column, DataType, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty({ example: "1", description: "ID" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @ApiProperty({ example: "Hello World", description: "Full Name" })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;
  @ApiProperty({ example: "pharacist@gmail.com", description: "Email" })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;
  @ApiProperty({ example: "12345678", description: "Password" })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: "pharmacy", description: "role", nullable: false })
  @Column({ type: DataType.STRING, allowNull: false })
  role: Role;

  @ApiProperty({ example: "Suceava", description: "location", nullable: false })
  @Column({ type: DataType.STRING, allowNull: false })
  location: string;

  @ApiProperty({ example: "4355678456", description: "CUI", nullable: false })
  @Column({ type: DataType.STRING, allowNull: false })
  cui: string;

  @ApiProperty({
    example: "Str. Oituz 34",
    description: "Street",
    nullable: true,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  street?: string;

  @ApiProperty({
    example: "08:00 - 21:00",
    description: "Schedule",
    nullable: true,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  schedule?: string;

  @ApiProperty({ example: "0741314156", description: "Phone", nullable: true })
  @Column({ type: DataType.STRING, allowNull: true })
  phone?: string;
}
