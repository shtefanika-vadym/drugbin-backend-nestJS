import { ProductPack } from "src/expired-products/enum/product-pack";
import { Drug } from "src/drugs/drugs.model";

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
