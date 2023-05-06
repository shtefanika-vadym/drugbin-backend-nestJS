import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/company/enum/Role";

export class RoleListResponse {
  @ApiProperty({ type: String, enum: Role, isArray: true })
  roles: Role[];
}
