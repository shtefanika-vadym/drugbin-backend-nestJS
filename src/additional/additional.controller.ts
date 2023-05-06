import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AdditionalService } from "src/additional/additional.service";
import { RoleListResponse } from "src/additional/responses/role-list-response";
import { LocationListResponse } from "src/additional/responses/location-list-response";

@ApiTags("Additional")
@Controller("additional")
export class AdditionalController {
  constructor(private additionalService: AdditionalService) {}

  // Retrieve all roles
  @ApiOperation({ summary: "Get all roles" })
  @ApiResponse({ status: 200, type: [RoleListResponse] })
  @Get("/roles")
  getRoles(): RoleListResponse {
    return this.additionalService.getListRoles();
  }

  // Retrieve all locations
  @ApiOperation({ summary: "Get all locations" })
  @ApiResponse({ status: 200, type: [LocationListResponse] })
  @Get("/locations")
  getLocations(): LocationListResponse {
    return this.additionalService.getListLocations();
  }
}
