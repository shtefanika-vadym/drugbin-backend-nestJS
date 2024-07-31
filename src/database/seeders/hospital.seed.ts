import { Seeder, OnSeederInit } from "nestjs-sequelize-seeder";
import * as MOCK_DATA from "src/hospital/hospital.json";
import { Hospital } from "src/hospital/hospital.model";
import { IHospital } from "src/hospital/interfaces/hospital.interface";

@Seeder({
  unique: ["id"],
  model: Hospital as any,
  enableAutoId: false,
  containsForeignKeys: true,
})
export class SeedHospital implements OnSeederInit {
  run(): IHospital[] {
    return MOCK_DATA["hospitals"].map(
      (
        { region, lat, lng, fullAddress, ...rest },
        index: number
      ): IHospital => ({
        ...rest,
        lat: String(lat),
        lng: String(lng),
        fullAddress: fullAddress,
        regionShortName: region.short_name,
        regionLongName: region.long_name,
        password: process.env.MOCK_PASSWORD,
        id: index + 1,
      })
    );
  }
}
