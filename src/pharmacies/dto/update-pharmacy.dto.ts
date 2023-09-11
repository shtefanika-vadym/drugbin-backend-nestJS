import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsPhoneNumber,
} from "class-validator";

export class UpdatePharmacyDto {
  @ApiProperty({ example: "Hello World", description: "Full Name" })
  @IsString({ message: "Name must be a string" })
  @MinLength(1, { message: "Name must not be empty" })
  @MaxLength(255, {
    message: "Name must be shorter than or equal to 255 characters",
  })
  name: string;

  @ApiProperty({ example: "pharacist@gmail.com", description: "Email" })
  @IsString({ message: "Email must be a string" })
  @IsEmail({}, { message: "Invalid email" })
  email: string;

  @ApiProperty({ example: "Suceava", description: "Location" })
  @IsString({ message: "Location must be a string" })
  @MinLength(1, { message: "Location must not be empty" })
  @MaxLength(255, {
    message: "Location must be shorter than or equal to 255 characters",
  })
  location: string;

  @ApiProperty({ example: "Str. Oituz 34", description: "Street" })
  @IsString({ message: "Street must be a string" })
  @MinLength(1, { message: "Street must not be empty" })
  @MaxLength(255, {
    message: "Street must be shorter than or equal to 255 characters",
  })
  readonly street: string;

  @ApiProperty({
    example: "08:00 - 21:00",
    description: "Schedule",
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: "Schedule must be a string" })
  @MinLength(1, { message: "Schedule must not be empty" })
  @MaxLength(255, {
    message: "Schedule must be shorter than or equal to 255 characters",
  })
  readonly schedule: string;

  @ApiProperty({ example: "0741314156", description: "Phone", nullable: true })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: "Invalid phone number" })
  readonly phone: string;
}
