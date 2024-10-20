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
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { DrugCategory } from "src/vision/interfaces/identified-drug.interface";

interface DocumentCreationAttrs {
  endDate: string;
  startDate: string;
  category: DrugCategory;
}

@Table({ tableName: "document", underscored: true })
export class Document extends Model<Document, DocumentCreationAttrs> {
  @ApiProperty()
  @PrimaryKey
  @AutoIncrement
  @Unique
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.INTEGER)
  hospitalId: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  documentId: string;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  startDate: string;

  @ApiProperty()
  @AllowNull(true)
  @Column(DataType.DATE)
  deletedAt: Date;

  @ApiProperty()
  @AllowNull(true)
  @Column(DataType.DATE)
  sharedAt: Date;

  @ApiProperty()
  @AllowNull(false)
  @Column(DataType.STRING)
  endDate: string;

  @AllowNull(false)
  @IsEnum(DrugCategory)
  @Column(DataType.INTEGER)
  category: DrugCategory;
}
