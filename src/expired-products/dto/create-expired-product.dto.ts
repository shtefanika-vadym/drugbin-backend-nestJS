import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsEnum,
} from "class-validator";
import { ProductPack } from "src/expired-products/enum/product-pack";
import { DrugType } from "src/drug-stock/enum/drug-type";

export class CreateExpiredProductDto {
  @ApiProperty({ example: "Omeprazol TERAPIA", description: "Name" })
  @IsString({ message: "Name must be a string" })
  @MinLength(1, { message: "Name must not be empty" })
  @MaxLength(255, {
    message: "Name must be shorter than or equal to 255 characters",
  })
  readonly name: string;

  @ApiProperty({ example: DrugType.otc, description: "Type" })
  @IsEnum(DrugType, {
    message: "Pack type must be one of the allowed values",
  })
  readonly type: DrugType;

  @ApiProperty({ example: 1, description: "Quantity" })
  @IsNumber(undefined, { message: "Quantity must be a number" })
  readonly quantity: number;

  @ApiProperty({ example: ProductPack.pack, description: "Pack" })
  @IsEnum(ProductPack, {
    message: "Pack type must be one of the allowed values",
  })
  readonly pack: ProductPack;

  @ApiProperty({ example: 1, description: "Drug ID" })
  @IsNumber(undefined, { message: "Drug ID must be a number" })
  readonly drugId: number;
}
