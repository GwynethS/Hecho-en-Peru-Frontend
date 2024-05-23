import { LocalCraftsman } from "../../local-craftsmen/models/local-craftsman";
import { Category } from "./category";

export interface Product {
  id: string;
  category: Category;
  localCraftsman: LocalCraftsman;
  name: string;
  price: number;
  image: File;
  availability: boolean;
  stock: number;
  averageRating: number;
  history: string;
  details: string;
  enabled: boolean;
}
