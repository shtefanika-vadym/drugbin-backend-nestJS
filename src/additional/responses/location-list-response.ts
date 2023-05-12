import { ApiProperty } from "@nestjs/swagger";

export class LocationListResponse {
  @ApiProperty({ type: String, isArray: true })
  locations: string[];
}
