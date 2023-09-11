import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ChainsService } from "src/chains/chains.service";
import { Chain } from "src/chains/chains.model";

@ApiTags("Chains")
@Controller("chains")
export class ChainsController {
  constructor(private chainService: ChainsService) {}

  // Get all chains
  @ApiOperation({ summary: "Get list chain" })
  @ApiResponse({ status: 200, type: [Chain] })
  @Get()
  getAll(): Promise<Chain[]> {
    return this.chainService.getAll();
  }
}
