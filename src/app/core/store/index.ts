import { AuthReducer, authFeatureKey } from "./auth/auth.reducer";

export const appReducers = {
  [authFeatureKey]: AuthReducer
}