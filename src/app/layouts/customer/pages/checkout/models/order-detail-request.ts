import { Product } from "../../../../admin/pages/products/models/product";

export interface OrderDetailRequest{
  product: Product,
  quantity: number,
  subTotal?: number
}