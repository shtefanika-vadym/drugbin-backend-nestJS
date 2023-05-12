import { Injectable } from "@nestjs/common";
import { Role } from "src/company/enum/Role";
import { LOCATIONS } from "src/locations";
import { RoleListResponse } from "src/additional/responses/role-list-response";
import { LocationListResponse } from "src/additional/responses/location-list-response";

@Injectable()
export class AdditionalService {
   getListRoles():RoleListResponse {
    return { roles: [Role.recycle, Role.pharmacy] };
  }

  getListLocations():LocationListResponse {
    return { locations: LOCATIONS };
  }
}
