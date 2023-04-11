import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, MaxLength } from "class-validator";

export class CreateExpiredProductDto {
  @ApiProperty({ example: "Omeprazol TERAPIA", description: "Name" })
  @IsString({ message: "Name must be a string" })
  @MinLength(1, { message: "Name must not be empty" })
  @MaxLength(255, {
    message: "Name must be shorter than or equal to 255 characters",
  })
  readonly name: string;

  @ApiProperty({ example: "GASTROREZ", description: "Brand" })
  @IsString({ message: "Brand must be a string" })
  @MinLength(1, { message: "Brand must not be empty" })
  @MaxLength(255, {
    message: "Brand must be shorter than or equal to 255 characters",
  })
  readonly brand: string;

  @ApiProperty({ example: "OTC", description: "Type" })
  @IsString({ message: "Type must be a string" })
  @MinLength(1, { message: "Type must not be empty" })
  @MaxLength(255, {
    message: "Type must be shorter than or equal to 255 characters",
  })
  readonly type: string;

  @ApiProperty({ example: "Blister", description: "Pack" })
  @IsString({ message: "Pack must be a string" })
  @MinLength(1, { message: "Pack must not be empty" })
  @MaxLength(255, {
    message: "Pack must be shorter than or equal to 255 characters",
  })
  readonly pack: string;
}
