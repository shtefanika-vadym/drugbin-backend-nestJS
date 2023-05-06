import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
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
  getAllDrugByPharmacy(
    @Headers("Authorization") token: string
  ): Promise<RecycleDrug[]> {
    return this.recycleDrugService.getAllDrugByPharmacy(token);
  }

  // Get verbal process
  @ApiOperation({ summary: "Get verbal process" })
  @Get("/:id")
  async getVerbalProcess(@Param("id") id: number, @Res() res): Promise<void> {
    try {
      const verbalProcessPdf = await this.recycleDrugService.getVerbalProcess(
        id
      );
      res.send(verbalProcessPdf);
    } catch (error) {
      if (error instanceof NotFoundException)
        res.status(404).send({ error: error.message });
      else res.status(500).send({ error: "Internal Server Error" });
    }
  }
}
