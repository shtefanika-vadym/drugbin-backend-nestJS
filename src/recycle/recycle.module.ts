import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { RecycleController } from "src/recycle/recycle.controller";
import { RecycleService } from "src/recycle/recycle.service";
import { Recycle } from "src/recycle/recycle.model";
import { AuthModule } from "src/auth/auth.module";
import { HospitalService } from "src/hospital/hospital.service";
import { Hospital } from "src/hospital/hospital.model";
import { TokenUtils } from "src/utils/token.utils";
import { DrugService } from "src/drug/drug.service";
import { Drug } from "src/drug/drug.model";
import { PuppeteerService } from "src/puppeteer/puppetter.service";
import { VisionService } from "src/vision/vision.service";
import { PaginationHelper } from "src/helpers/pagination.helper";

@Module({
  controllers: [RecycleController],
  providers: [
    RecycleService,
    PuppeteerService,
    HospitalService,
    TokenUtils,
    DrugService,
    VisionService,
    PaginationHelper,
  ],
  imports: [
    SequelizeModule.forFeature([Recycle, Hospital, Drug]),
    forwardRef(() => AuthModule),
  ],
  exports: [],
})
export class RecycleModule {}
