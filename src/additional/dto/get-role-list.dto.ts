import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/hospital/enum/Role";

export class GetRoleListDto {
  @ApiProperty({ type: String, enum: Role, isArray: true })
  roles: Role[];
}
