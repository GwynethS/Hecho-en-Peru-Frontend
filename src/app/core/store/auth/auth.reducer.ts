import { createReducer, on } from "@ngrx/store";
import { AuthAction } from "./auth.actions";
import { LoginResponse } from "../../../layouts/customer/pages/auth/models/login-response";

export const authFeatureKey = 'auth';

export interface State {
  user: LoginResponse | null;
}

export const initialState: State = {
  user: null
}

export const AuthReducer = createReducer(
  initialState,
  on(AuthAction.setAuthUser, (state, action) => {
    return {
      ...state,
      user: action.user,
    };
  }),
  on(AuthAction.logout, () => initialState)
);