import { Module } from "@nestjs/common";
import { ExpiredProductsService } from "src/expired-products/expired-products.service";
import { ExpiredProductsController } from "src/expired-products/expired-products.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { ExpiredProduct } from "src/expired-products/expired-products.model";
import { TokenUtils } from "src/utils/token.utils";
import { AuthModule } from "src/auth/auth.module";
import { CompanyService } from "src/company/company.service";
import { Company } from "src/company/company.model";
import { DrugStockService } from "src/drug-stock/drug-stock.service";
import { DrugStock } from "src/drug-stock/drug-stock.model";

@Module({
  providers: [
    TokenUtils,
    CompanyService,
    DrugStockService,
    ExpiredProductsService,
  ],
  controllers: [ExpiredProductsController],
  imports: [
    SequelizeModule.forFeature([ExpiredProduct, Company, DrugStock]),
    AuthModule,
  ],
})
export class ExpiredProductsModule {}
