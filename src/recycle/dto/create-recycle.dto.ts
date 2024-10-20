import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  ValidateNested,
  IsArray,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";
import { ProductPack } from "src/recycle/enum/product-pack";
import { DrugCategory } from "src/vision/interfaces/identified-drug.interface";

class DrugDto {
  @ApiProperty({
    example: 10,
    description: "The quantity of the drug",
    required: true,
  })
  @IsNumber(undefined, { message: "Quantity must be a number" })
  readonly quantity: number;

  @ApiProperty({
    example: ProductPack.box,
    description: "Pack",
    required: true,
  })
  @IsEnum(ProductPack, {
    message: "Pack type must be one of the allowed values",
  })
  readonly pack: ProductPack;

  readonly atc: string | null;
  readonly name: string | null;
  readonly prescription: string | null;
  readonly concentration: string | null;

  @ApiProperty({
    example: "2023-01-01",
    description: "The expiration date of the drug",
  })
  @IsOptional()
  @IsDateString(undefined, { message: "Invalid date string" })
  readonly expirationDate: string;

  @IsEnum(DrugCategory, {
    message: "category type must be one of the allowed values",
  })
  readonly category: DrugCategory;
}

export class CreateRecycleDto {
  @ApiProperty({
    example: "Ion",
    description: "First Name",
    required: true,
  })
  @IsString({ message: "First Name must be a string" })
  @MinLength(1, { message: "First Name must not be empty" })
  @MaxLength(255, {
    message: "First Name must be shorter than or equal to 255 characters",
  })
  readonly firstName: string;

  @IsOptional()
  @IsString({ message: "CNP" })
  @MinLength(1, { message: "CNP" })
  readonly cnp: string;

  @IsOptional()
  @IsString({ message: "Address" })
  readonly address: string;

  @ApiProperty({
    example: 1,
    description: "Hospital Id",
    required: true,
  })
  @IsNumber(undefined, { message: "Hospital Id must be a number" })
  readonly hospitalId: number;

  @ApiProperty({
    example: "Popescu",
    description: "Last Name",
    required: true,
  })
  @IsString({ message: "Last Name must be a string" })
  @MinLength(1, { message: "Last Name must not be empty" })
  @MaxLength(255, {
    message: "Last Name must be shorter than or equal to 255 characters",
  })
  readonly lastName: string;

  @ApiProperty({
    example: "test@gmail.com",
    description: "Email",
    required: true,
  })
  @IsOptional()
  @IsString({ message: "Email must be a string" })
  @IsEmail({}, { message: "Invalid email" })
  @MaxLength(255, {
    message: "Email must be shorter than or equal to 255 characters",
  })
  readonly email: string;

  @IsArray()
  @Type(() => DrugDto)
  @ValidateNested({ each: true })
  readonly drugList: DrugDto[];
}
