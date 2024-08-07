import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Document } from "src/documents/documents.model";
import { DocumentsService } from "src/documents/documents.service";
import { DocumentsController } from "src/documents/documents.controller";
import { AuthModule } from "src/auth/auth.module";
import { RecycleService } from "src/recycle/recycle.service";
import { Recycle } from "src/recycle/recycle.model";
import { PuppeteerService } from "src/puppeteer/puppetter.service";
import { HospitalService } from "src/hospital/hospital.service";
import { DrugService } from "src/drug/drug.service";
import { PaginationHelper } from "src/helpers/pagination.helper";
import { Hospital } from "src/hospital/hospital.model";
import { Drug } from "src/drug/drug.model";
import { VisionService } from "src/vision/vision.service";

@Module({
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    RecycleService,
    PuppeteerService,
    HospitalService,
    DrugService,
    PaginationHelper,
    VisionService,
  ],
  imports: [
    SequelizeModule.forFeature([Document, Recycle, Hospital, Drug]),
    forwardRef(() => AuthModule),
  ],
  exports: [],
})
export class DocumentsModule {}
