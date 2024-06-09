import { Customer } from "../../../models/customer";

export interface Order {
  id: string;
  customer: Customer;
  dateCreated: Date;
  total: number;
}
