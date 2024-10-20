import { ProductPack } from "src/recycle/enum/product-pack";
import { DrugCategories } from "src/vision/interfaces/identified-drug.interface";

export interface IDrug {
  quantity: number;
  pack: ProductPack;
  atc: string | null;
  name: string | null;
  category: DrugCategories;
  prescription: string | null;
  concentration: string | null;
  expirationDate: string | null;
}
