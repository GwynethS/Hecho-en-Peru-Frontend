import { createReducer, on } from "@ngrx/store";
import { AuthAction } from "./auth.actions";
import { UserLogin } from "../../../layouts/customer/pages/auth/models/user-login";

export const authFeatureKey = 'auth';

export interface State {
  user: UserLogin | null;
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