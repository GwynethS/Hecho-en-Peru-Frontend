import { Role } from "../../../../admin/pages/customers/models/role";

export interface UserLogin {
  id: string;
  name: string;
  lastName: string;
  dateCreated: string;
  email: string;
  password: number;
  enabled: number;
  roles: Role[];
  token: string;
}