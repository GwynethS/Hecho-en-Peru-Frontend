export interface Product {
  id: string;
  name: string;
  category_name: string;
  region_name: string;
  localCraftsman_fullname: string;
  price: number;
  stock: number;
  averageRating: number;
  history: string;
  details: string;
  image: File;
  enable: boolean;
}
