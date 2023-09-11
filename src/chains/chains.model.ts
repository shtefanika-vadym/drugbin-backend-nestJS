import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  Unique,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Pharmacy } from "src/pharmacies/pharmacy.model";

interface ChainCreationAttrs {
  name: string;
  email: string;
  description: string;
  image: string;
}

@Table({ tableName: "chains" })
export class Chain extends Model<Chain, ChainCreationAttrs> {
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
  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  description: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  image: string;

  @HasMany(() => Pharmacy)
  pharmacies: Pharmacy[];
}
