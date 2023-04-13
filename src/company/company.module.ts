import { forwardRef, Module } from "@nestjs/common";
import { CompanyController } from "src/company/company.controller";
import { CompanyService } from "src/company/company.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Company } from "src/company/company.model";
import { ExpiredProduct } from "src/expired-products/expired-products.model";
import { AuthModule } from "src/auth/auth.module";
import { DrugStockService } from "src/drug-stock/drug-stock.service";
import { DrugStock } from "src/drug-stock/drug-stock.model";

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, DrugStockService],
  imports: [
    SequelizeModule.forFeature([Company, ExpiredProduct, DrugStock]),
    forwardRef(() => AuthModule),
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
