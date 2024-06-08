import { Customer } from "../../../../admin/pages/customers/models/customer";
import { OrderDetailRequest } from "./order-detail-request";

export interface OrderRequest{
  user: Customer,
  total: number,
  orderDetails: OrderDetailRequest[]
}