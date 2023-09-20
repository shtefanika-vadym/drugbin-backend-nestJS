import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DashboardDto {
  @ApiProperty({
    example: "05-2023",
    description: "Date",
    required: true,
  })
  @IsString({ message: "Date must be a string" })
  readonly date: string;
}
