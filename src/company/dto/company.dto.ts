import { ApiProperty } from "@nestjs/swagger";

export class CompanyDto {
  @ApiProperty({ example: 1, description: "ID" })
  id: number;

  @ApiProperty({ example: "Hello World", description: "Full Name" })
  name: string;

  @ApiProperty({ example: "pharacist@gmail.com", description: "Email" })
  email: string;

  @ApiProperty({ example: "Suceava", description: "Location" })
  location: string;

  @ApiProperty({ example: "Str. Oituz 34", description: "Street" })
  street: string;

  @ApiProperty({ example: "2023-04-08T14:34:44.421Z", description: "Schedule" })
  schedule: string;

  @ApiProperty({
    example: "2023-04-08T14:34:44.421Z",
    description: "Created At",
  })
  createdAt: string;

  @ApiProperty({ example: "0741234567", description: "Phone" })
  phone: string;
}
