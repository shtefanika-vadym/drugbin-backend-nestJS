import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  ValidateNested,
  IsArray,
  IsEnum, IsOptional
} from "class-validator";
import { Type } from "class-transformer";
import { ProductPack } from "src/expired-products/enum/product-pack";

class IDrug {
  @ApiProperty({
    example: 123,
    description: "Drug id",
  })
  readonly id: number;

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
  readonly expirationDate: string;
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

  @ApiProperty({ type: [IDrug], description: "Message", required: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IDrug)
  readonly drugList: IDrug[];
}
