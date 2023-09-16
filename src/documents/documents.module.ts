import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Document } from "src/documents/documents.model";
import { DocumentsService } from "src/documents/documents.service";
import { DocumentsController } from "src/documents/documents.controller";
import { AuthModule } from "src/auth/auth.module";
import { RecycleDrugService } from "src/recycle-drug/recycle-drug.service";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";
import { PuppeteerService } from "src/puppeteer/puppetter.service";
import { PharmacyService } from "src/pharmacies/pharmacy.service";
import { ChainsService } from "src/chains/chains.service";
import { DrugsService } from "src/drugs/drugs.service";
import { PaginationHelper } from "src/helpers/pagination.helper";
import { Pharmacy } from "src/pharmacies/pharmacy.model";
import { Chain } from "src/chains/chains.model";
import { Drug } from "src/drugs/drugs.model";
import { VisionService } from "src/vision/vision.service";

@Module({
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    RecycleDrugService,
    PuppeteerService,
    PharmacyService,
    ChainsService,
    DrugsService,
    PaginationHelper,
    VisionService,
  ],
  imports: [
    SequelizeModule.forFeature([Document, RecycleDrug, Pharmacy, Chain, Drug]),
    forwardRef(() => AuthModule),
  ],
  exports: [],
})
export class DocumentsModule {}
