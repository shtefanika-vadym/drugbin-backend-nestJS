import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DrugsService } from "src/drugs/drugs.service";
import { Drug } from "src/drugs/drugs.model";

@ApiTags("Drugs")
@Controller("drugs")
export class DrugsController {
  constructor(private drugService: DrugsService) {}

  // Get drugs by name
  @ApiOperation({ summary: "Get drugs by name" })
  @ApiResponse({ status: 200, type: [Drug] })
  @Get("/:name?")
  getDrugsByName(@Param("name") name?: string): Promise<Drug[]> {
    return this.drugService.getDrugsByName(name);
  }
}
