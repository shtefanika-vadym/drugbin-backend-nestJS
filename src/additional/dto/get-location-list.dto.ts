import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/company/enum/Role";

export class GetLocationListDto {
  @ApiProperty({ type: String, isArray: true })
  locations: string[];
}
