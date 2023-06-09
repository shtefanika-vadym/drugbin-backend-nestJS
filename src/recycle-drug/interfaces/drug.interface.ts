import { Drug } from "src/drugs/drugs.model";
import { ProductPack } from "src/recycle-drug/enum/product-pack";

export interface IDrug {
  lot?: number;
  drugId: number;
  quantity: number;
  pack: ProductPack;
  expirationDate?: string;
}

export interface IRecycledDrug extends IDrug {
  drugDetails: Drug;
}
