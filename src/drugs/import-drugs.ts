import { Drug } from "src/drugs/drugs.model";
import { DRUG_LIST2 } from "src/drugs/drugs2";

export const importDrugs = async (): Promise<void> => {
  const drugs: Drug[] = await Drug.findAll();
  if (!drugs.length) await Drug.bulkCreate(DRUG_LIST2 as Drug[]);
};
