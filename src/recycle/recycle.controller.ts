import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RecycleService } from "src/recycle/recycle.service";
import { CreateRecycleDto } from "src/recycle/dto/create-recycle.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Recycle } from "src/recycle/recycle.model";
import { CreateRecycleResponse } from "src/recycle/responses/create-recycle-response";
import { MessageResponse } from "src/reponses/message-response";
import { HospitalId } from "src/auth/hospital-id.decorator";
import { IRecycledDrug } from "src/recycle/interfaces/drug.interface";
import { IVerbalData } from "src/recycle/interfaces/verbal-data.interface";
import { IPagination } from "src/helpers/pagination.interface";

@ApiTags("Recycle Drug")
@Controller("recycle")
export class RecycleController {
  constructor(private recycleDrugService: RecycleService) {}

  // Create recycle drug
  @ApiOperation({ summary: "Create recycle drug" })
  @ApiResponse({ status: 200, type: CreateRecycleResponse })
  @Post()
  async create(@Body() dto: CreateRecycleDto): Promise<CreateRecycleResponse> {
    return this.recycleDrugService.create(dto);
  }

  // Get all recycle drug
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all recycle drug" })
  @ApiResponse({ status: 200, type: [Recycle] })
  @Get()
  getDrugsByhospitalId(
    @HospitalId() id: number,
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 10
  ): Promise<any> {
    return this.recycleDrugService.getDrugsByHospitalId(id, page, limit);
  }

  // Get filtered drugs by (id or name)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get filtered drugs by (id or name)" })
  @Get("/search/:query")
  getFilteredDrugsByName(
    @HospitalId() id: number,
    @Param("query") query: string,
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 10
  ): Promise<IPagination<Recycle[]>> {
    return this.recycleDrugService.getFilteredDrugsByName(
      query,
      id,
      page,
      limit
    );
  }

  // Get all drugs
  @UseGuards(JwtAuthGuard)
  @Get("/history")
  getAllDrugsByPharmacy(
    @HospitalId() id: number,
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 10
  ): Promise<IPagination<IRecycledDrug[]>> {
    return this.recycleDrugService.getAllDrugsByPharmacy(id, page, limit);
  }

  // Confirm recycle drug status
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Confirm recycle drug status" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Patch("/:id")
  updateRecycleDrugStatus(
    @HospitalId() companyId: number,
    @Param("id") id: number
  ): Promise<MessageResponse> {
    return this.recycleDrugService.updateRecycleDrugStatus(id, companyId);
  }

  // Get data for verbal process
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get data for verbal process" })
  @Get("/verbal-process/:id")
  async getVerbalData(@Param("id") id: number): Promise<IVerbalData> {
    return this.recycleDrugService.getVerbalData(id);
  }

  // Get monthly audit
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get monthly audit" })
  @Get("/audit")
  async getMonthlyAudit(@Res() res, @HospitalId() id: number): Promise<any> {
    try {
      const monthlyAuditPdf = await this.recycleDrugService.getMonthlyAudit(id);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=pdf.pdf`,
        "Content-Length": monthlyAuditPdf.length,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      });
      res.end(monthlyAuditPdf);
    } catch (error) {
      if (error instanceof NotFoundException)
        res.status(404).send({ error: error.message });
      else res.status(500).send({ error: "Internal Server Error" });
    }
  }
}
