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
      (hospital: IHospital, index: number): IHospital => ({
        ...hospital,
        id: index + 1,
        password: process.env.MOCK_PASSWORD,
      })
    );
  }
}
