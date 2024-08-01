import { ProductPack } from "src/recycle/enum/product-pack";

export interface IDrug {
  quantity: number;
  pack: ProductPack;
  atc: string | null;
  name: string | null;
  prescription: string | null;
  concentration: string | null;
  expirationDate: string | null;
}
