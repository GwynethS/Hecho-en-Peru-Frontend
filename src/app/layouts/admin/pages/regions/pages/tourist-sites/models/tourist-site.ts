import { Region } from "../../../models/region";

export interface TouristSite {
  id: string;
  name: string;
  image: string;
  description: string;
  region: Region;
}
