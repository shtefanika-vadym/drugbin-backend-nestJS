import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Drug } from "src/drugs/drugs.model";
import { DrugsController } from "src/drugs/drugs.controller";
import { DrugsService } from "src/drugs/drugs.service";

@Module({
  controllers: [DrugsController],
  providers: [DrugsService],
  imports: [SequelizeModule.forFeature([Drug])],
  exports: [DrugsService],
})
export class DrugsModule {}
