import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/company/enum/Role";

export class LoginResponse {
  @ApiProperty({ description: "Role" })
  role: Role;
  @ApiProperty({ description: "Token" })
  token: string;
}
