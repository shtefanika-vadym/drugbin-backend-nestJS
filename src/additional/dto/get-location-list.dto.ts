import { ApiProperty } from "@nestjs/swagger";

export class GetLocationListDto {
  @ApiProperty({ type: String, isArray: true })
  locations: string[];
}
