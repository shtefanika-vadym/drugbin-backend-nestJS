import {
  Body,
  Controller,
  Delete,
  Get,
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
import { IDrug } from "src/recycle/interfaces/drug.interface";
import { IPagination } from "src/helpers/pagination.interface";
import { RecycleUtils } from "src/recycle/utils/recycle-drug.utils";
import { Readable } from "stream";
import { DrugCategories } from "src/vision/interfaces/identified-drug.interface";

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

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete recycle drug by recycle_ID" })
  @ApiResponse({ status: 200, type: [MessageResponse] })
  @Delete("/:id")
  deleteById(
    @HospitalId() hospitalId: number,
    @Param("id") id: string
  ): Promise<any> {
    return this.recycleDrugService.deleteById(hospitalId, id);
  }

  @ApiOperation({ summary: "Get recycle drug by recycle_ID" })
  @ApiResponse({ status: 200, type: [Recycle] })
  @Get("/:id")
  getById(@Param("id") id: string): Promise<any> {
    return this.recycleDrugService.getById(id);
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
  ): Promise<IPagination<IDrug[]>> {
    return this.recycleDrugService.getAllDrugsByPharmacy(id, page, limit);
  }

  // Confirm recycle drug status
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update recycle drug status" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Patch("/:id")
  updateRecycleDrugStatus(
    @HospitalId() companyId: number,
    @Param("id") id: number
  ): Promise<MessageResponse> {
    return this.recycleDrugService.updateRecycleDrugStatus(id, companyId);
  }

  // Get data for verbal process
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get data for verbal process" })
  @Get("/process/:id")
  async getVerbalData(
    @Res() res: any,
    @Param("id") id: string,
    @Query("category") category: DrugCategories
  ): Promise<any> {
    try {
      const recycleData = await this.recycleDrugService.getVerbalData(id);
      const doc = RecycleUtils.getRecycleDoc(recycleData, +category);

      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).send("Error generating PDF");
    }
  }

  private sendPdfResponse(res: any, pdfBuffer: Buffer): void {
    const stream = new Readable();
    stream.push(pdfBuffer);
    stream.push(null);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=result.pdf");
    stream.pipe(res);
  }

  // Get monthly audit
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: "Get monthly audit" })
  // @Get("/audit")
  // async getMonthlyAudit(@Res() res): Promise<any> {
  //   try {
  //     const monthlyAuditPdf = await this.recycleDrugService.getMonthlyAudit(1);
  //     res.set({
  //       "Content-Type": "application/pdf",
  //       "Content-Disposition": `attachment; filename=pdf.pdf`,
  //       "Content-Length": monthlyAuditPdf.length,
  //       "Cache-Control": "no-cache, no-store, must-revalidate",
  //       Pragma: "no-cache",
  //       Expires: 0,
  //     });
  //     res.end(monthlyAuditPdf);
  //   } catch (error) {
  //     if (error instanceof NotFoundException)
  //       res.status(404).send({ error: error.message });
  //     else res.status(500).send({ error: "Internal Server Error" });
  //   }
  // }
}
