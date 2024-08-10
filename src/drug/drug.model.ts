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
import { ApiProperty } from "@nestjs/swagger";

@Table({ tableName: "drug", underscored: true })
export class Drug extends Model<Drug> {
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
  @AllowNull(true)
  @Column(DataType.STRING)
  atc: string;

  @ApiProperty()
  @AllowNull(true)
  @Column(DataType.STRING)
  concentration: string;

  @ApiProperty()
  @AllowNull(true)
  @Column(DataType.STRING)
  prescription: string;

  @ApiProperty()
  @AllowNull(true)
  @Column(DataType.STRING)
  packaging: string;
}
