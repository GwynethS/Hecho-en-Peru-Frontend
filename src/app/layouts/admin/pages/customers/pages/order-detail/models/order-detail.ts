import { Product } from "../../../../products/models/product";
import { Order } from "./order";

export interface OrderDetail {
  id: string;
  order: Order;
  product: Product;
  quantity: number;
  subTotal: number;
}
