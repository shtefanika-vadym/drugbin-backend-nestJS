import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/company/enum/Role";
import { CreateDrugDto } from "src/drug-stock/dto/create-drug.dto";
import { DrugStockService } from "src/drug-stock/drug-stock.service";
import { DrugType } from "src/drug-stock/enum/drug-type";
import { DrugStock } from "src/drug-stock/drug-stock.model";
import { MessageResponse } from "src/reponses/message-response";

@UseGuards(JwtAuthGuard)
@ApiTags("Drug Stock")
@Controller("drug-stock")
export class DrugStockController {
  constructor(private drugStockService: DrugStockService) {}

  // Create drug.interface.ts
  @ApiOperation({ summary: "Create drug" })
  @UseGuards(RolesGuard)
  @Roles(Role.pharmacy)
  @Post()
  create(@Body() dto: CreateDrugDto): Promise<MessageResponse> {
    return this.drugStockService.create(dto);
  }

  // Filter drugs by barcode or name
  @ApiOperation({ summary: "Get drugs by same name or barcode" })
  @ApiResponse({ status: 200, type: [DrugStock] })
  @Get("/:type/:query")
  filterByBarcode(
    @Param("type") type: DrugType,
    @Param("query") query: string
  ): Promise<DrugStock[]> {
    return this.drugStockService.filter(type, query);
  }
}
