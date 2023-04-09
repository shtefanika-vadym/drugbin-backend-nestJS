import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsPhoneNumber } from "class-validator";

export class UpdateCompanyDto {
  @ApiProperty({ example: "Hello World", description: "Full Name" })
  @IsString({ message: "Must be string" })
  name: string;
  @ApiProperty({ example: "pharacist@gmail.com", description: "Email" })
  @IsString({ message: "Must be string" })
  email: string;
  @ApiProperty({ example: "Suceava", description: "Location" })
  @IsString({ message: "Must be string" })
  location: string;

  @ApiProperty({ example: "Str. Oituz 34", description: "Street" })
  @IsString({ message: "Must be string" })
  readonly street: string;

  @ApiProperty({
    example: "08:00 - 21:00",
    description: "Schedule",
    nullable: true,
  })
  @IsString({ message: "Must be string" })
  readonly schedule: string;

  @ApiProperty({ example: "0741314156", description: "Phone", nullable: true })
  @IsPhoneNumber()
  readonly phone: string;
}
