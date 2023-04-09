import { ApiProperty } from "@nestjs/swagger";
import { Status } from "src/expired-products/enum/Status";

export class GetExpiredProductDto {
  @ApiProperty({ example: 1, description: "Id" })
  id: number;
  @ApiProperty({ example: "Omeprazol TERAPIA", description: "Name" })
  name: string;
  @ApiProperty({ example: "GASTROREZ", description: "Brand" })
  brand: string;
  @ApiProperty({ example: "OTC", description: "Type" })
  type: string;
  @ApiProperty({ example: "Blister", description: "Pack" })
  pack: string;
  @ApiProperty({ example: "pending", enum: Status, description: "Status" })
  status: Status;
  @ApiProperty({
    example: "2023-04-08T10:20:39.771Z",
    description: "Created At",
  })
  createdAt: string;
}
