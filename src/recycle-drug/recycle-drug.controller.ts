import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
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
import { CompanyId } from "src/auth/company-id.decorator";
import { IRecycledDrug } from "src/recycle-drug/interfaces/drug.interface";

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
  @ApiResponse({ status: 200, type: [CreateRecycleDrugDto] })
  @Get()
  getAllDrugByPharmacy(@CompanyId() id: number): Promise<RecycleDrug[]> {
    return this.recycleDrugService.getAllDrugByPharmacy(id);
  }

  // Get all drugs
  @UseGuards(JwtAuthGuard)
  @Get("/history")
  getAllDrugsByPharmacy(@CompanyId() id: number): Promise<IRecycledDrug[]> {
    return this.recycleDrugService.getAllDrugsByPharmacy(id);
  }

  // Confirm recycle drug status
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Confirm recycle drug status" })
  @ApiResponse({ status: 200, type: MessageResponse })
  @Patch("/:id")
  updateRecycleDrugStatus(
    @CompanyId() companyId: number,
    @Param("id") id: number
  ): Promise<MessageResponse> {
    return this.recycleDrugService.updateRecycleDrugStatus(id, companyId);
  }

  // Get verbal process
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get verbal process" })
  @Get("/verbal-process/:id")
  async getVerbalProcess(@Param("id") id: number, @Res() res): Promise<void> {
    try {
      const verbalProcessPdf = await this.recycleDrugService.getVerbalProcess(
        id
      );
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=pdf.pdf`,
        "Content-Length": verbalProcessPdf.length,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: 0,
      });
      res.end(verbalProcessPdf);
    } catch (error) {
      if (error instanceof NotFoundException)
        res.status(404).send({ error: error.message });
      else res.status(500).send({ error: "Internal Server Error" });
    }
  }

  // Get monthly audit
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get monthly audit" })
  @Get("/audit")
  async getMonthlyAudit(@Res() res, @CompanyId() id: number): Promise<any> {
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
