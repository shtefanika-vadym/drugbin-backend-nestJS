import { Drug } from "src/drug/drug.model";
import { ProductPack } from "src/recycle/enum/product-pack";

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
