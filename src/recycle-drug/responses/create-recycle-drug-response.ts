import { ApiProperty } from "@nestjs/swagger";

export class CreateRecycleDrugResponse {
  @ApiProperty({ description: "Drug Code" })
  readonly drugCode: number;
}
