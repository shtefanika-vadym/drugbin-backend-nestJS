import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { HospitalService } from "src/hospital/hospital.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/hospital/enum/Role";
import { UpdateHospitalDto } from "src/hospital/dto/update-hospital.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { MessageResponse } from "src/reponses/message-response";
import { Hospital } from "src/hospital/hospital.model";
import { HospitalDto } from "src/hospital/dto/hospital.dto";
import { IPagination } from "src/helpers/pagination.interface";

@ApiTags("Hospital")
@Controller("hospitals")
export class HospitalController {
  constructor(private companyService: HospitalService) {}

  // Retrieve all hospitals
  @ApiOperation({ summary: "Get all hospitals" })
  @ApiResponse({ status: 200, type: [Hospital] })
  @Get()
  async getAllPharmacies(
    @Query("county") county?: string,
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 10
  ): Promise<IPagination<Hospital[]>> {
    return this.companyService.getAllPaginatedHospitals(county, page, limit);
  }

  // Update a hospital
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update hospital" })
  @ApiResponse({ status: 200, type: [MessageResponse] })
  @Put(":id")
  updateCompany(
    @Body() companyDto: UpdateHospitalDto,
    @Param("id") id: string
  ): Promise<MessageResponse> {
    return this.companyService.updateCompany(companyDto, id);
  }

  @ApiResponse({ status: 200, type: Hospital })
  @Get("/location")
  getNearestHospital(
    @Query("lat") lat: number,
    @Query("lng") lng: number
  ): Promise<Hospital> {
    return this.companyService.getNearestHospital({ lat, lng });
  }

  @ApiResponse({ status: 200, type: [String] })
  @Get("/counties")
  getAllCounties(): Promise<string[]> {
    return this.companyService.getAllCounties();
  }

  // Retrieve hospital details
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get hospital details" })
  @UseGuards(RolesGuard)
  @Roles(Role.recycle)
  @ApiResponse({ status: 200, type: [HospitalDto] })
  @Get("/:id")
  getPharmacy(@Param("id") id: number) {
    return this.companyService.getPharmacyDetails(id);
  }
}
