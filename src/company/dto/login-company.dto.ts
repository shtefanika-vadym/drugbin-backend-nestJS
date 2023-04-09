import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginCompanyDto {
  @ApiProperty({ example: "company@gmail.com", description: "Email" })
  @IsString({ message: "Must be string" })
  @IsEmail({}, { message: "Invalid email" })
  readonly email: string;
  @ApiProperty({ example: "12345", description: "password" })
  @IsString({ message: "Must be string" })
  @Length(4, 16, { message: "Between 4 and 16" })
  readonly password: string;
}
