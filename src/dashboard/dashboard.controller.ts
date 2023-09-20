import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { DashboardService } from "src/dashboard/dashboard.service";
import { PharmacyId } from "src/auth/pharmacy-id.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { DashboardDatePipe } from "src/filters/dashboard-pipe";

@UseGuards(JwtAuthGuard)
@ApiTags("Dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  // Get dashboard info
  @ApiOperation({ summary: "Get dashboard info" })
  @Get("/:date")
  async get(
    @PharmacyId() id: number,
    @Param(new DashboardDatePipe()) year: string
  ): Promise<any> {
    return this.dashboardService.get(id, year);
  }
}
