import { LocalCraftsman } from "../../local-craftsmen/models/local-craftsman";
import { Category } from "./category";

export interface ProductRequest {
  id: string;
  name: string;
  category_id: Category;
  localCraftsman_id: LocalCraftsman;
  price: number;
  stock: number;
  history: string;
  details: string;
}
