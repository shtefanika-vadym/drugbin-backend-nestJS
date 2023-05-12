import { Module } from "@nestjs/common";
import { DrugStockService } from "src/drug-stock/drug-stock.service";
import { DrugStockController } from "src/drug-stock/drug-stock.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "src/auth/auth.module";
import { DrugStock } from "src/drug-stock/drug-stock.model";

@Module({
  providers: [DrugStockService],
  controllers: [DrugStockController],
  imports: [SequelizeModule.forFeature([DrugStock]), AuthModule],
  exports: [DrugStockService],
})
export class DrugStockModule {}
