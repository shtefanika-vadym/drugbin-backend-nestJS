import { ApiProperty } from "@nestjs/swagger";
import { ProductStatus } from "src/expired-products/enum/product-status";

export class ExpiredProductDto {
  @ApiProperty({ example: 1, description: "Id" })
  id: number;
  @ApiProperty({ example: "Omeprazol TERAPIA", description: "Name" })
  name: string;
  @ApiProperty({ example: "OTC", description: "Type" })
  type: string;
  @ApiProperty({ example: "pill", description: "Pack" })
  pack: string;
  @ApiProperty({ example: 12, description: "Quantity" })
  quantity: number;
  @ApiProperty({
    example: "2023-04-08T10:20:39.771Z",
    description: "Created At",
  })
  status: ProductStatus;
  @ApiProperty({
    example: "2023-04-08T10:20:39.771Z",
    description: "Created At",
  })
  createdAt: string;

  @ApiProperty({ example: 1, description: "Drug ID" })
  drugId: number;
}
