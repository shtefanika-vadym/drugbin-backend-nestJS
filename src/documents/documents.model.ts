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
import { DocumentType } from "src/documents/enum/document-type";

interface DocumentCreationAttrs {
  endDate: string;
  startDate: string;
  documentType: DocumentType;
}

@Table({ tableName: "documents" })
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
  pharmacyId: number;

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
  @IsEnum(DocumentType)
  @Column(DataType.ENUM(...Object.values(DocumentType)))
  documentType: DocumentType;
}
