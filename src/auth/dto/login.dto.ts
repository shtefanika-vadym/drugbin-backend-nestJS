import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "pharmacy1@dona.com", description: "Email" })
  @IsString({ message: "Email must be a string" })
  @IsEmail({}, { message: "Invalid email" })
  readonly email: string;

  @ApiProperty({ example: "Test12345%", description: "password" })
  @IsString({ message: "Password must be a string" })
  @Length(4, 16, { message: "Password must be between 4 and 16 characters" })
  readonly password: string;
}
