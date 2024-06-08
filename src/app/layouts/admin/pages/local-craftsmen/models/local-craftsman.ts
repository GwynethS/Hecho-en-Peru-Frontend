import { Region } from "./region";

export interface LocalCraftsman {
  id: string;
  fullName: string;
  description: string;
  specialty: string;
  image: string;
  experience: string;
  region: Region;
  enabled: boolean;
}
