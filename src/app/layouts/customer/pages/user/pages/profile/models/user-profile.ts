import { Role } from "../../../../../../admin/pages/customers/models/role";

export interface UserProfile{
  id: string;
  name: string;
  lastName: string;
  dateCreated: string;
  email: string;
  password: string;
  newPassword: string;
  enabled: boolean;
  roles: Role[];
}