import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { RecycleDrugController } from "src/recycle-drug/recycle-drug.controller";
import { RecycleDrugService } from "src/recycle-drug/recycle-drug.service";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";
import { AuthModule } from "src/auth/auth.module";
import { PharmacyService } from "src/pharmacies/pharmacy.service";
import { Pharmacy } from "src/pharmacies/pharmacy.model";
import { TokenUtils } from "src/utils/token.utils";
import { DrugsService } from "src/drugs/drugs.service";
import { Drug } from "src/drugs/drugs.model";
import { PuppeteerService } from "src/puppeteer/puppetter.service";
import { VisionService } from "src/vision/vision.service";

@Module({
  controllers: [RecycleDrugController],
  providers: [
    RecycleDrugService,
    PuppeteerService,
    PharmacyService,
    TokenUtils,
    DrugsService,
    VisionService,
  ],
  imports: [
    SequelizeModule.forFeature([RecycleDrug, Pharmacy, Drug]),
    forwardRef(() => AuthModule),
  ],
  exports: [],
})
export class RecycleDrugModule {}
