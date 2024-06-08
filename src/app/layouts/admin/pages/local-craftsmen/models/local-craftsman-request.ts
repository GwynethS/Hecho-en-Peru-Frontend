import { Region } from "./region";

export interface LocalCraftsmanRequest {
  id: string;
  fullName: string;
  description: string;
  specialty: string;
  image: string;
  experience: string;
  region_id: Region;
}
