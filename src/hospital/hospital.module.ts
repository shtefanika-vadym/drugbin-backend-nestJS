import { forwardRef, Module } from "@nestjs/common";
import { HospitalController } from "src/hospital/hospital.controller";
import { HospitalService } from "src/hospital/hospital.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Hospital } from "src/hospital/hospital.model";
import { AuthModule } from "src/auth/auth.module";
import { SeederModule } from "nestjs-sequelize-seeder";
import { SeedHospital } from "src/database/seeders/hospital.seed";

@Module({
  controllers: [HospitalController],
  providers: [HospitalService],
  imports: [
    SequelizeModule.forFeature([Hospital]),
    SeederModule.forFeature([SeedHospital]),
    forwardRef(() => AuthModule),
  ],
  exports: [HospitalService],
})
export class HospitalModule {}
