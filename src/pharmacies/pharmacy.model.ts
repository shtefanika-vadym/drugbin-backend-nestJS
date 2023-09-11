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
import { ApiProperty } from "@nestjs/swagger";
import { Chain } from "src/chains/chains.model";

interface CompanyCreationAttrs {
  name: string;
  email: string;
  password: string;
  location: string;
}

@Table({ tableName: "pharmacies" })
export class Pharmacy extends Model<Pharmacy, CompanyCreationAttrs> {
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

  @ForeignKey(() => Chain)
  @Column(DataType.INTEGER)
  chainId: number;

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
  @AllowNull(true)
  @Column(DataType.STRING)
  location?: string;

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

  @BelongsTo(() => Chain)
  chain: Chain;
}
