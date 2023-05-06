import { Injectable } from "@nestjs/common";
import { Role } from "src/company/enum/Role";
import { LOCATIONS } from "src/locations";
import { createPdf } from "@saemhco/nestjs-html-pdf";
import * as path from "path";

@Injectable()
export class AdditionalService {
  async getListRoles() {
    const data = {
      date: new Date()
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-"),
      firstName: "Shtefanika",
      lastName: "Vadym",
      pharmacyName: "Catena",
      drugList: [
        {
          name: "Paduden",
          quantity: 32,
          pack: "Blister",
          lot: 23,
          expirationDate: "19-02-2022",
        },
        {
          name: "Paduden",
          quantity: 4,
          pack: "Blister",
          lot: 23,
          expirationDate: "19-02-2022",
        },
        {
          name: "Paduden",
          quantity: 12,
          pack: "Blister",
          lot: 23,
          expirationDate: "19-02-2022",
        },
        {
          name: "Paduden",
          lot: 23,
          expirationDate: "19-02-2022",
          quantity: 3,
          pack: "Blister",
        },
      ],
    };
    const options = {
      format: "A4",
      displayHeaderFooter: false,
      margin: {
        left: "20mm",
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
      },
      landscape: false,
    };
    const filePath = path.join(process.cwd(), "templates", "pdf-verbal-process.hbs");
    return createPdf(filePath, options, data);
    return { roles: [Role.recycle, Role.pharmacy] };
  }

  getListLocations() {
    return { locations: LOCATIONS };
  }
}
