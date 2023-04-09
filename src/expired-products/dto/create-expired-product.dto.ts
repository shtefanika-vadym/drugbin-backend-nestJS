import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateExpiredProductDto {
  @ApiProperty({ example: "Omeprazol TERAPIA", description: "Name" })
  @IsString({ message: "Must be string" })
  readonly name: string;
  @ApiProperty({ example: "GASTROREZ", description: "Brand" })
  @IsString({ message: "Must be string" })
  readonly brand: string;
  @ApiProperty({ example: "OTC", description: "Type" })
  @IsString({ message: "Must be string" })
  readonly type: string;
  @ApiProperty({ example: "Blister", description: "Pack" })
  @IsString({ message: "Must be string" })
  readonly pack: string;
}
