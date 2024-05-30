import { Region } from "../../../models/region";

export interface TouristSite {
    id: string;
    description: string;
    image: string;
    name: string;
    region: Region;
  }
  