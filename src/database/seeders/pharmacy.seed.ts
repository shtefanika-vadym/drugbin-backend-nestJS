import { Seeder, OnSeederInit } from "nestjs-sequelize-seeder";
import * as MOCK_DATA from "src/chains/chains.json";
import { Pharmacy } from "src/pharmacies/pharmacy.model";

@Seeder({
  unique: ["id"],
  model: Pharmacy as any,
  enableAutoId: false,
  containsForeignKeys: true,
})
export class PharmacySeed implements OnSeederInit {
  run() {
    const pharmacies = [];
    const chains = MOCK_DATA["chains"];
    for (let i = 0; i < chains.length; i++) {
      const chain = chains[i];
      for (let j = 1; j <= 10; j++) {
        const extendedPharmacy = {
          chainId: Number(chain.id),
          id: pharmacies.length + 1,
          name: `${chain.name} ${j}`,
          password: process.env.MOCK_PASSWORD,
          email: chain.email.replace("@", `${j}@`),
        };

        pharmacies.push(extendedPharmacy);
      }
    }
    return pharmacies;
  }
}
