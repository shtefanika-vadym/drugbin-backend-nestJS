import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { RecycleDrugController } from "src/recycle-drug/recycle-drug.controller";
import { RecycleDrugService } from "src/recycle-drug/recycle-drug.service";
import { RecycleDrug } from "src/recycle-drug/recycle-drug.model";

@Module({
  controllers: [RecycleDrugController],
  providers: [RecycleDrugService],
  imports: [SequelizeModule.forFeature([RecycleDrug])],
  exports: [],
})
export class RecycleDrugModule {}
