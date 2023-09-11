import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { PharmacyService } from "src/pharmacies/pharmacy.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/pharmacies/enum/Role";
import { UpdatePharmacyDto } from "src/pharmacies/dto/update-pharmacy.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { MessageResponse } from "src/reponses/message-response";
import { Pharmacy } from "src/pharmacies/pharmacy.model";
import { PharmacyDto } from "src/pharmacies/dto/pharmacy.dto";

@UseGuards(JwtAuthGuard)
@ApiTags("Pharmacies")
@Controller("pharmacies")
export class PharmacyController {
  constructor(private companyService: PharmacyService) {}

  // Retrieve all pharmacies
  @ApiOperation({ summary: "Get all pharmacies" })
  @ApiResponse({ status: 200, type: [Pharmacy] })
  @Get("/pharmacies")
  async getAllPharmacies(): Promise<Pharmacy[]> {
    return this.companyService.getAllCompanies(Role.pharmacy);
  }

  // Update a pharmacies
  @ApiOperation({ summary: "Update pharmacies" })
  @ApiResponse({ status: 200, type: [MessageResponse] })
  @Put(":id")
  updateCompany(
    @Body() companyDto: UpdatePharmacyDto,
    @Param("id") id: string
  ): Promise<MessageResponse> {
    return this.companyService.updateCompany(companyDto, id);
  }

  // Retrieve pharmacy details
  @ApiOperation({ summary: "Get pharmacy details" })
  @UseGuards(RolesGuard)
  @Roles(Role.recycle)
  @ApiResponse({ status: 200, type: [PharmacyDto] })
  @Get("/pharmacies/:id")
  getPharmacy(@Param("id") id: number) {
    return this.companyService.getPharmacyDetails(id);
  }
}
