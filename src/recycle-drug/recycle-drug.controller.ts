import { Body, Controller, Get, Post, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CompanyDto } from "src/company/dto/company.dto";
import { ValidationPipe } from "src/pipes/validation.pipe";
import { RecycleDrugService } from "src/recycle-drug/recycle-drug.service";
import { CreateRecycleDrugDto } from "src/recycle-drug/dto/create-recycle-drug.dto";

@ApiTags("Recycle Drug")
@Controller("recycle-drug")
export class RecycleDrugController {
  constructor(private recycleDrugService: RecycleDrugService) {}

  // Create recycle drug
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: "Create recycle drug" })
  @Post()
  async create(@Body() dto: CreateRecycleDrugDto) {
    const response = await this.recycleDrugService.create(dto);
    return response;
  }

  // Create recycle drug
  @ApiOperation({ summary: "Create recycle drug" })
  @ApiResponse({ status: 200, type: [CreateRecycleDrugDto] })
  @Get()
  async getAll() {
    const response = await this.recycleDrugService.getAll();
    return response;
  }
}
