import { forwardRef, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { RecycleDrugController } from "src/recycle-drug/recycle-drug.controller";
import { RecycleDrugService } from "src/recycle-drug/recycle-drug.service";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";
import { AuthModule } from "src/auth/auth.module";
import { CompanyService } from "src/company/company.service";
import { Company } from "src/company/company.model";
import { ExpiredProduct } from "src/expired-products/expired-products.model";
import { TokenUtils } from "src/utils/token.utils";
import { DrugsService } from "src/drugs/drugs.service";
import { Drug } from "src/drugs/drugs.model";

@Module({
  controllers: [RecycleDrugController],
  providers: [RecycleDrugService, CompanyService, TokenUtils, DrugsService],
  imports: [
    SequelizeModule.forFeature([RecycleDrug, ExpiredProduct, Company, Drug]),
    forwardRef(() => AuthModule),
  ],
  exports: [],
})
export class RecycleDrugModule {}
