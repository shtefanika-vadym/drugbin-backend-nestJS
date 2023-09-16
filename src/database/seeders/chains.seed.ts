import { Seeder, OnSeederInit } from "nestjs-sequelize-seeder";
import { Chain } from "src/chains/chains.model";
import { IChain } from "src/chains/interfaces/chain.interface";
import * as MOCK_DATA from "src/chains/chains.json";

@Seeder({
  unique: ["id"],
  model: Chain as any,
  enableAutoId: false,
  containsForeignKeys: true,
})
export class SeedChain implements OnSeederInit {
  run(): IChain[] {
    return MOCK_DATA["chains"];
  }
}
