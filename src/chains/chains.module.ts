import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ChainsService } from "src/chains/chains.service";
import { ChainsController } from "src/chains/chains.controller";
import { Chain } from "src/chains/chains.model";
import { SeederModule } from "nestjs-sequelize-seeder";
import { SeedChain } from "src/chains/chains.seed";

@Module({
  controllers: [ChainsController],
  providers: [ChainsService],
  imports: [
    SequelizeModule.forFeature([Chain]),
    SeederModule.forFeature([SeedChain]),
  ],
  exports: [],
})
export class ChainsModule {}
