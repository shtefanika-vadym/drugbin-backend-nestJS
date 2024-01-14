import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";

export class CreateHospitalDto {
  @ApiProperty({
    example: "Spitalul Județean Sf. Ioan",
    description: "Company Name",
    required: true,
  })
  @IsString({ message: "Company Name must be a string" })
  @MinLength(1, { message: "Company Name must not be empty" })
  @MaxLength(255, {
    message: "Company Name must be shorter than or equal to 255 characters",
  })
  readonly name: string;

  @ApiProperty({
    example: "pharmacies@gmail.com",
    description: "Email",
    required: true,
  })
  @IsString({ message: "Email must be a string" })
  @IsEmail({}, { message: "Invalid email" })
  @MaxLength(255, {
    message: "Email must be shorter than or equal to 255 characters",
  })
  readonly email: string;

  @ApiProperty({ example: "12345", description: "Password", required: true })
  @IsString({ message: "Password must be a string" })
  @MinLength(4, { message: "Password must be at least 4 characters long" })
  @MaxLength(16, {
    message: "Password must be shorter than or equal to 16 characters",
  })
  readonly password: string;

  @ApiProperty({ example: "Suceava", description: "Location", required: true })
  @IsString({ message: "Location must be a string" })
  @MinLength(1, { message: "Location must not be empty" })
  @MaxLength(255, {
    message: "Location must be shorter than or equal to 255 characters",
  })
  readonly location: string;

  @ApiProperty({ example: "4355678456", description: "CUI", required: true })
  @IsString({ message: "CUI must be a string" })
  @MinLength(1, { message: "CUI must not be empty" })
  @MaxLength(255, {
    message: "CUI must be shorter than or equal to 255 characters",
  })
  readonly cui: string;
}
