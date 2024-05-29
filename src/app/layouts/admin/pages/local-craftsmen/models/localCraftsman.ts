import { Region } from "./region";

export interface LocalCraftsman {
  id: string;
  fullName: string;
  description: string;
  specialty: string;
  image: File;
  experience: string;
  region: Region;
  enabled: boolean;
}
