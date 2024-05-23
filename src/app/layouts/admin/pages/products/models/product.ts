import { LocalCraftsman } from "../../local-craftsmen/models/local-craftsman";
import { Category } from "./category";

export interface Product {
  id: string;
  name: string;
  category: Category;
  localCraftsman: LocalCraftsman;
  price: number;
  stock: number;
  averageRating: number;
  history: string;
  details: string;
  image: File;
  enabled: boolean;
}
