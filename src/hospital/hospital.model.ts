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
import { Recycle } from "src/recycle/recycle.model";

interface HospitalCreationAttrs {
  name: string;
  password: string;
}

@Table({
  tableName: "hospital",
  underscored: true,
})
export class Hospital extends Model<Hospital, HospitalCreationAttrs> {
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
  email: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  lat: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  lng: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  password: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  fullAddress: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  regionLongName: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  regionShortName: string;

  @HasMany(() => Recycle)
  recycleList: Recycle[];
}
