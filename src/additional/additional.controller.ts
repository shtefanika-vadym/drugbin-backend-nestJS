import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdditionalService } from "src/additional/additional.service";
import { GetRoleListDto } from "src/additional/dto/get-role-list.dto";
import { GetLocationListDto } from "src/additional/dto/get-location-list.dto";

@ApiTags("Additional")
@Controller("additional")
export class AdditionalController {
  constructor(private additionalService: AdditionalService) {}

  @ApiOperation({ summary: "Get all roles" })
  @ApiResponse({ status: 200, type: [GetRoleListDto] })
  @Get("/roles")
  async getRoles() {
    const roles = await this.additionalService.getListRoles();
    return roles;
  }

  @ApiOperation({ summary: "Get all locations" })
  @ApiResponse({ status: 200, type: [GetLocationListDto] })
  @Get("/locations")
  async getLocations() {
    const locations = await this.additionalService.getListLocations();
    return locations;
  }
}
