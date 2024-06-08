import { AuthReducer, authFeatureKey } from "./auth/auth.reducer";
import { ShoppingCartReducer, shoppingCartFeatureKey } from "./shopping-cart/shopping-cart.reducer";

export const appReducers = {
  [authFeatureKey]: AuthReducer,
  [shoppingCartFeatureKey]: ShoppingCartReducer
}