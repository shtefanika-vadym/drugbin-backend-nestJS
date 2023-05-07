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
import { ProductPack } from "src/expired-products/enum/product-pack";

class DrugDto {
  @ApiProperty({
    example: 123,
    description: "The lot number",
  })
  readonly lot: number;

  @ApiProperty({
    example: 10,
    description: "The quantity of the drug",
    required: true,
  })
  @IsNumber(undefined, { message: "Quantity must be a number" })
  readonly quantity: number;

  @ApiProperty({
    example: ProductPack.pack,
    description: "Pack",
    required: true,
  })
  @IsEnum(ProductPack, {
    message: "Pack type must be one of the allowed values",
  })
  readonly pack: ProductPack;

  @ApiProperty({
    example: "2023-01-01",
    description: "The expiration date of the drug",
  })
  @IsDateString(undefined, { message: "Invalid date string" })
  readonly expirationDate: string;

  @ApiProperty({
    required: true,
    example: 1,
    description: "Selected drug id from drugs",
  })
  @IsNumber(undefined, { message: "Drug Id must be a number" })
  readonly drugId;
}

export class CreateRecycleDrugDto {
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

  @ApiProperty({
    example: 1,
    description: "Pharmacy Id",
    required: true,
  })
  @IsNumber(undefined, { message: "Pharmacy Id must be a number" })
  readonly pharmacyId: number;

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

  @ApiProperty({ type: [DrugDto], description: "Drug List", required: true })
  @IsArray()
  @Type(() => DrugDto)
  @ValidateNested({ each: true })
  readonly drugList: DrugDto[];
}
