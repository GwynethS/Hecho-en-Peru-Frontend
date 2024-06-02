import { LocalCraftsman } from "../../local-craftsmen/models/localCraftsman";
import { Category } from "./category";
import { Region } from '../../regions/models/region';

export interface Product {
  id: string;
  name: string;
  category: Category;
  localCraftsman: LocalCraftsman;
  price: number;
  image: string;
  availability: boolean;
  stock: number;
  averageRating: number;
  history: string;
  details: string;
  enabled: boolean;
}
