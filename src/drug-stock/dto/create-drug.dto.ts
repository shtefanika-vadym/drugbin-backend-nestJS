import { DrugType } from "src/drug-stock/enum/drug-type";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import {
  IsEnum,
  IsInt,
  IsNumber,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { ProductPack } from "src/expired-products/enum/product-pack";

export class CreateDrugDto {
  @ApiProperty({ example: "Paduden", description: "Name" })
  @IsString({ message: "Name must be a string" })
  @MinLength(1, { message: "Name must not be empty" })
  @MaxLength(255, {
    message: "Name must be shorter than or equal to 255 characters",
  })
  readonly name: string;
  @ApiProperty({
    example: ProductPack.pack,
    description: "Package",
    enum: ProductPack,
  })
  @IsEnum(ProductPack, {
    message: "Package must be one of the allowed values",
  })
  readonly package: ProductPack;

  @ApiProperty({ example: 32, description: "Package Total Elements" })
  @IsInt({ message: "Package Total Elements must be an integer" })
  @Min(1, {
    message: "Package Total Elements must be greater than or equal to 1",
  })
  readonly package_total: number;

  @ApiProperty({ example: 32, description: "Strength", required: false })
  @IsNumber(undefined, { message: "Strength must be a number" })
  readonly strength?: number;

  @ApiProperty({ example: 32, description: "Weight" })
  @IsNumber(undefined, { message: "Weight must be a number" })
  readonly weight: number;

  @ApiProperty({
    example: DrugType.otc,
    description: "Drug TypeProduct",
    enum: DrugType,
  })
  @IsEnum(DrugType, {
    message: "Drug TypeProduct must be one of the allowed values",
  })
  readonly type: DrugType;

  @ApiProperty({ example: 67875434567768765, description: "Barcode" })
  @IsString({ message: "Barcode must be a string" })
  @MinLength(1, { message: "Barcode must not be empty" })
  @MaxLength(255, {
    message: "Barcode must be shorter than or equal to 255 characters",
  })
  readonly barcode: string;
}
