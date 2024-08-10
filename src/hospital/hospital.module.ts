import { forwardRef, Module } from "@nestjs/common";
import { HospitalController } from "src/hospital/hospital.controller";
import { HospitalService } from "src/hospital/hospital.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Hospital } from "src/hospital/hospital.model";
import { AuthModule } from "src/auth/auth.module";
import { SeederModule } from "nestjs-sequelize-seeder";
import { SeedHospital } from "src/database/seeders/hospital.seed";
import { PaginationHelper } from "src/helpers/pagination.helper";

@Module({
  controllers: [HospitalController],
  providers: [HospitalService, PaginationHelper],
  imports: [
    SequelizeModule.forFeature([Hospital]),
    SeederModule.forFeature([SeedHospital]),
    forwardRef(() => AuthModule),
  ],
  exports: [HospitalService],
})
export class HospitalModule {}
