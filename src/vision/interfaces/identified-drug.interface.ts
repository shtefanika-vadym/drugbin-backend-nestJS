export enum DrugCategory {
  Cytototoxic = 1,
  Inhalers = 2,
  Injectables = 3,
  Insulin = 4,
  Common = 5,
  Supplements = 6,
  Psycholeptics = 7,
}

type PrescriptionType = "PR" | "PRF" | "OTC" | "RX";

export interface IdentifiedDrug {
  name: string;
  package: "syringe" | "injectable" | "box" | "entity";
  concentration: string | null;
  count: number;
  prescription: PrescriptionType;
  atc: string | null;
  category: DrugCategory;
  text: string;
}

export type DrugCategory1 =
  | 1 // Cytotoxic and Cytostatic Drugs
  | 2 // Inhalers
  | 3 // Injectables or Syringes
  | 4 // Insulin
  | 5 // Common Medicines
  | 6 // Supplements
  | 7; // Psycholeptics
