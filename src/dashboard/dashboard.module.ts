import { forwardRef, Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Recycle } from "src/recycle/recycle.model";
import { Hospital } from "src/hospital/hospital.model";
import { Drug } from "src/drug/drug.model";
import { AuthModule } from "src/auth/auth.module";
import { RecycleService } from "src/recycle/recycle.service";
import { PuppeteerService } from "src/puppeteer/puppetter.service";
import { HospitalService } from "src/hospital/hospital.service";
import { DrugService } from "src/drug/drug.service";
import { PaginationHelper } from "src/helpers/pagination.helper";
import { VisionService } from "src/vision/vision.service";

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    RecycleService,
    PuppeteerService,
    HospitalService,
    DrugService,
    PaginationHelper,
    VisionService,
  ],
  imports: [
    SequelizeModule.forFeature([Recycle, Hospital, Drug]),
    forwardRef(() => AuthModule),
  ],
})
export class DashboardModule {}
