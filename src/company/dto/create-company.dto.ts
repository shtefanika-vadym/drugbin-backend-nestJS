import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString, Length } from "class-validator";
import { Role } from "src/company/enum/Role";

export class CreateCompanyDto {
  @ApiProperty({
    example: "Catena1",
    description: "Company Name",
    nullable: false,
  })
  @IsString({ message: "Must be string" })
  readonly name: string;

  @ApiProperty({
    example: "company@gmail.com",
    description: "Email",
    nullable: false,
  })
  @IsString({ message: "Must be string" })
  @IsEmail({}, { message: "Invalid email" })
  readonly email: string;

  @ApiProperty({ example: "12345", description: "password", nullable: false })
  @IsString({ message: "Must be string" })
  @Length(4, 16, { message: "Between 4 and 16" })
  readonly password: string;

  @ApiProperty({
    example: "pharmacy",
    description: "role",
    nullable: false,
    enum: Role,
  })
  @IsEnum(Role)
  readonly role: Role;

  @ApiProperty({ example: "Suceava", description: "location", nullable: false })
  @IsString({ message: "Must be string" })
  readonly location: string;

  @ApiProperty({ example: "4355678456", description: "CUI", nullable: false })
  @IsString({ message: "Must be string" })
  readonly cui: string;
}
