import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/pharmacies/enum/Role";

export class GetRoleListDto {
  @ApiProperty({ type: String, enum: Role, isArray: true })
  roles: Role[];
}
