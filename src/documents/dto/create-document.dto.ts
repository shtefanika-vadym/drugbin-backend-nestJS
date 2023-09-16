import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class CreateDocumentDto {
  @ApiProperty({
    example: "2023-01-01",
    description: "The start date of the document",
  })
  @IsDateString(undefined, { message: "Invalid date string" })
  readonly startDate: string;

  @ApiProperty({
    example: "2023-01-02",
    description: "The start date of the document",
  })
  @IsDateString(undefined, { message: "Invalid date string" })
  readonly endDate: string;
}