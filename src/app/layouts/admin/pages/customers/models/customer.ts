import { Role } from "./role";

export interface Customer {
  id: string;
  name: string;
  lastName: string;
  dateCreated: string;
  email: string;
  password: number;
  enabled: number;
  roles: Role[];
}
