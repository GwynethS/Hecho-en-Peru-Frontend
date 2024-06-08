import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromShoppingCart from './shopping-cart.reducer';

export const selectShoppingCartState = createFeatureSelector<fromShoppingCart.State>(
  fromShoppingCart.shoppingCartFeatureKey
);

export const selectShoppingCartProducts = createSelector(
  selectShoppingCartState,
  (state) => state.orderDetails
);

export const selectShoppingCartTotal = createSelector(
  selectShoppingCartState,
  (state) => state.total
);