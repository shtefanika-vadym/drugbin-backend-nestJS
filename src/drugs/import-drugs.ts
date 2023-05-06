import { Drug } from "src/drugs/drugs.model";
import { DRUG_LIST } from "src/drugs/drugs";

export const importDrugs = async (): Promise<void> => {
  const drugs = await Drug.findAll();
  if (!drugs.length) await Drug.bulkCreate(DRUG_LIST as Drug[]);
};
