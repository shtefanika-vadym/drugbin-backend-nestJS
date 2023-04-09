import { GetCompanyDto } from "src/company/dto/get-company.dto";
import { GetExpiredProductDto } from "src/expired-products/dto/get-expired-product.dto";
import { ApiProperty } from "@nestjs/swagger";

export class GetPharmacyDetailsDto extends GetCompanyDto {
  @ApiProperty({ type: GetExpiredProductDto, isArray: true })
  expiredProducts: GetExpiredProductDto[];
}
