import { LocalCraftsman } from "../../local-craftsmen/models/localCraftsman";
import { Category } from "./category";

export interface Product {
  id: string;
  name: string;
  category: Category;
  localCraftsman: LocalCraftsman;
  price: number;
  image: File;
  availability: boolean;
  stock: number;
  averageRating: number;
  history: string;
  details: string;
  enabled: boolean;
}
