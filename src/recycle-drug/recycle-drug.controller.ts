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
import { RecycleDrugService } from "src/recycle-drug/recycle-drug.service";
import { CreateRecycleDrugDto } from "src/recycle-drug/dto/create-recycle-drug.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";
import { CreateRecycleDrugResponse } from "src/recycle-drug/responses/create-recycle-drug-response";
import { MessageResponse } from "src/reponses/message-response";
import { PharmacyId } from "src/auth/pharmacy-id.decorator";
import { IRecycledDrug } from "src/recycle-drug/interfaces/drug.interface";
import { IVerbalData } from "src/recycle-drug/interfaces/verbal-data.interface";
import { IPagination } from "src/helpers/pagination.interface";

@ApiTags("Recycle Drug")
@Controller("recycle-drug")
export class RecycleDrugController {
  constructor(private recycleDrugService: RecycleDrugService) {}

  // Create recycle drug
  @ApiOperation({ summary: "Create recycle drug" })
  @ApiResponse({ status: 200, type: CreateRecycleDrugResponse })
  @Post()
  async create(
    @Body() dto: CreateRecycleDrugDto
  ): Promise<CreateRecycleDrugResponse> {
    return this.recycleDrugService.create(dto);
  }

  // Get all recycle drug
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all recycle drug" })
  @ApiResponse({ status: 200, type: [RecycleDrug] })
  @Get()
  getDrugsByPharmacyId(
    @PharmacyId() id: number,
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 10
  ): Promise<any> {
    return this.recycleDrugService.getDrugsByPharmacyId(id, page, limit);
  }

  // Get filtered drugs by (id or name)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get filtered drugs by (id or name)" })
  @Get("/search/:query")
  getFilteredDrugsByName(
    @PharmacyId() id: number,
    @Param("query") query: string,
    @Query("page", ParseIntPipe) page: number = 1,
    @Query("limit", ParseIntPipe) limit: number = 10
  ): Promise<IPagination<RecycleDrug[]>> {
    return this.recycleDrugService.getFilteredDrugsByName(query, id, page, limit);
  }

  // Get all drugs
  @UseGuards(JwtAuthGuard)
  @Get("/history")
  getAllDrugsByPharmacy(@PharmacyId() id: number): Promise<IRecycledDrug[]> {
    return this.recycleDrugService.getAllDrugsByPharmacy(id);
  }

  // Confirm recycle drug status
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Confirm recycle drug status" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Patch("/:id")
  updateRecycleDrugStatus(
    @PharmacyId() companyId: number,
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
  async getMonthlyAudit(@Res() res, @PharmacyId() id: number): Promise<any> {
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
