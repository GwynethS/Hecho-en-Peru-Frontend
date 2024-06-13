import { Customer } from "../../../../../../admin/pages/customers/models/customer";
import { Product } from "../../../../../../admin/pages/products/models/product";

export interface Comment{
  id: string;
  rating: number;
  textCommentary: string;
  product: Product;
  user: Customer;
}
