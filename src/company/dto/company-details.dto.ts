import { CompanyDto } from "src/company/dto/company.dto";
import { ExpiredProductDto } from "src/expired-products/dto/expired-product.dto";
import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CompanyDetailsDto extends CompanyDto {
  @ApiProperty({ type: ExpiredProductDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => ExpiredProductDto)
  expiredProducts: ExpiredProductDto[];
}
