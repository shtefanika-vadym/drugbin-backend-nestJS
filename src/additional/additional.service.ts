import { Injectable } from "@nestjs/common";
import { Role } from "src/company/enum/Role";
import { LOCATIONS } from "src/locations";

@Injectable()
export class AdditionalService {
  getListRoles() {
    return { roles: [Role.recycle, Role.pharmacy] };
  }

  getListLocations() {
    return { locations: LOCATIONS };
  }
}
