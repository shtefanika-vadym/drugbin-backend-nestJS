import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { CompanyService } from "src/company/company.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/company/enum/Role";
import { UpdateCompanyDto } from "src/company/dto/update-company.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CompanyDetailsDto } from "src/company/dto/company-details.dto";
import { MessageResponse } from "src/reponses/message-response";
import { Company } from "src/company/company.model";

@UseGuards(JwtAuthGuard)
@ApiTags("Companies")
@Controller("companies")
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  // Retrieve all pharmacies
  @ApiOperation({ summary: "Get all pharmacies" })
  @ApiResponse({ status: 200, type: [Company] })
  @Get("/pharmacies")
  async getAllPharmacies(): Promise<Company[]> {
    return this.companyService.getAllCompanies(Role.pharmacy);
  }

  // Update a company
  @ApiOperation({ summary: "Update company" })
  @ApiResponse({ status: 200, type: [MessageResponse] })
  @Put(":id")
  updateCompany(
    @Body() companyDto: UpdateCompanyDto,
    @Param("id") id: string
  ): Promise<MessageResponse> {
    return this.companyService.updateCompany(companyDto, id);
  }

  // Retrieve pharmacy details
  @ApiOperation({ summary: "Get pharmacy details" })
  @UseGuards(RolesGuard)
  @Roles(Role.recycle)
  @ApiResponse({ status: 200, type: [CompanyDetailsDto] })
  @Get("/pharmacies/:id")
  getPharmacy(@Param("id") id: number) {
    return this.companyService.getPharmacyDetails(id);
  }
}
