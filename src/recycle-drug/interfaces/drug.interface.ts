import { ProductPack } from "src/expired-products/enum/product-pack";

export interface IDrug {
  id: number;
  lot?: number;
  quantity: number;
  pack: ProductPack;
  expirationDate?: string;
}
