import { Controller, Get, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdditionalService } from "src/additional/additional.service";
import { GetRoleListDto } from "src/additional/dto/get-role-list.dto";
import { GetLocationListDto } from "src/additional/dto/get-location-list.dto";

@ApiTags("Additional")
@Controller("additional")
export class AdditionalController {
  constructor(private additionalService: AdditionalService) {}

  // Retrieve all roles
  @ApiOperation({ summary: "Get all roles" })
  @ApiResponse({ status: 200, type: [GetRoleListDto] })
  @Get("/roles")
  async getRoles(@Res() res) {
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=verbal-process.pdf",
    });

    const pdf = await this.additionalService.getListRoles();
    res.send(pdf);
  }

  // Retrieve all locations
  @ApiOperation({ summary: "Get all locations" })
  @ApiResponse({ status: 200, type: [GetLocationListDto] })
  @Get("/locations")
  getLocations() {
    const locations = this.additionalService.getListLocations();
    return locations;
  }
}
