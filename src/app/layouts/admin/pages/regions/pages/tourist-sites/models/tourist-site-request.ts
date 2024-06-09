import { Region } from "../../../models/region";

export interface TouristSiteRequest {
  id: string;
  name: string;
  image: string;
  description: string;
  region_id: Region;
}
