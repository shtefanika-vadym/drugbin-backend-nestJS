import { ApiProperty } from "@nestjs/swagger";

export class CreateRecycleDrugResponse {
  @ApiProperty({ description: "Recycle Id" })
  readonly recycleId: string;
}
