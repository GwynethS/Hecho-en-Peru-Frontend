export interface Product{
  productId: string;
  name: string;
  category_name: string;
  region_name: string;
  localCraftsman_fullname: string;
  price: number;
  stock: number;
  average_rating: number;
  history: string;
  details: string;
  image: File;
  enable: boolean;
}