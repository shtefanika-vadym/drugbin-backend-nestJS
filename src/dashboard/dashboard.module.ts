import { forwardRef, Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";
import { Pharmacy } from "src/pharmacies/pharmacy.model";
import { Chain } from "src/chains/chains.model";
import { Drug } from "src/drugs/drugs.model";
import { AuthModule } from "src/auth/auth.module";
import { RecycleDrugService } from "src/recycle-drug/recycle-drug.service";
import { PuppeteerService } from "src/puppeteer/puppetter.service";
import { PharmacyService } from "src/pharmacies/pharmacy.service";
import { ChainsService } from "src/chains/chains.service";
import { DrugsService } from "src/drugs/drugs.service";
import { PaginationHelper } from "src/helpers/pagination.helper";
import { VisionService } from "src/vision/vision.service";

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    RecycleDrugService,
    PuppeteerService,
    PharmacyService,
    ChainsService,
    DrugsService,
    PaginationHelper,
    VisionService,
  ],
  imports: [
    SequelizeModule.forFeature([RecycleDrug, Pharmacy, Chain, Drug]),
    forwardRef(() => AuthModule),
  ],
})
export class DashboardModule {}
