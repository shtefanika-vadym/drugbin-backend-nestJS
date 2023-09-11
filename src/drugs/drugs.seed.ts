import { Seeder, OnSeederInit } from "nestjs-sequelize-seeder";
import { Drug } from "src/drugs/drugs.model";
import * as MOCK_DATA from "src/drugs/drugs.json";
import { IDrug } from "src/drugs/interfaces/drug.interface";

@Seeder({
  unique: ["id"],
  model: Drug as any,
  enableAutoId: false,
})
export class SeedDrug implements OnSeederInit {
  run(): IDrug[] {
    return MOCK_DATA["drugs"]
      .filter(({ name }: IDrug) => !!name)
      .map((drug: IDrug, index: number): IDrug => ({ ...drug, id: index + 1 }));
  }

  everyone(drug: IDrug): IDrug {
    const psycholeptics: string[] = ["N05"];
    const isPsycholeptic: boolean = Boolean(
      drug?.atc &&
        psycholeptics.some((prefix: string): boolean =>
          drug.atc.startsWith(prefix)
        )
    );
    return { ...drug, isPsycholeptic };
  }
}
