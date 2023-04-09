import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { CompanyService } from "src/company/company.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetCompanyDto } from "src/company/dto/get-company.dto";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/company/enum/Role";
import { UpdateCompanyDto } from "src/company/dto/update-company.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { GetPharmacyDetailsDto } from "src/company/dto/get-pharmacy-details.dto";

@ApiTags("Companies")
@Controller("companies")
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @ApiOperation({ summary: "Get all pharmacies" })
  @ApiResponse({ status: 200, type: [GetCompanyDto] })
  @UseGuards(RolesGuard)
  @Roles(Role.recycle)
  @Get("/pharmacies")
  async getAllPharmacies() {
    const pharmacists = await this.companyService.getAllCompanies(Role.pharmacy);
    return pharmacists;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update company" })
  @ApiResponse({ status: 200, type: [GetCompanyDto] })
  @Put(":id")
  async updateCompany(
    @Body() companyDto: UpdateCompanyDto,
    @Param("id") id: string
  ) {
    const company = await this.companyService.updateCompany(companyDto, id);
    return company;
  }

  @ApiOperation({ summary: "Get pharmacy details" })
  @UseGuards(RolesGuard)
  @Roles(Role.recycle)
  @ApiResponse({ status: 200, type: [GetPharmacyDetailsDto] })
  @Get("/pharmacies/:id")
  async getPharmacy(@Param("id") id: string) {
    const pharmacy = await this.companyService.getPharmacyById(id);
    return pharmacy;
  }
}
