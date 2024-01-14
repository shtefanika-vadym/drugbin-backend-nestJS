import { ApiProperty } from "@nestjs/swagger";

export class CreateRecycleResponse {
  @ApiProperty({ description: "Recycle Id" })
  readonly recycleId: string;
}
