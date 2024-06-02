import { Customer } from "../../../../admin/pages/customers/models/customer";
import { JwtResponse } from "./jwtResponse";

export interface LoginResponse{
  user: Customer,
  jwtResponse: JwtResponse
}