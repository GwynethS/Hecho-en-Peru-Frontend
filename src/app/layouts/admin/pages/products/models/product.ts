import { LocalCraftsman } from "../../local-craftsmen/models/local-craftsman";
import { Category } from "./category";

export interface Product {
  id: string;
  category: Category;
  localCraftsman: LocalCraftsman;
  name: string;
  details: string;
  history: string;
  price: number;
  image: File;
  availability: boolean;
  stock: number;
  averageRating: number;
  enabled: boolean;
}
