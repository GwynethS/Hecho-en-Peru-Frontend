import { createReducer, on } from "@ngrx/store";
import { OrderDetailRequest } from "../../../layouts/customer/models/order-detail-request";
import { ShoppingCartAction } from "./shopping-cart.actions";

export const shoppingCartFeatureKey = 'cart';

export interface State {
  products: OrderDetailRequest[],
  total: number
}

export const initialState: State = {
  products: [],
  total: 0
}

export const ShoppingCartReducer = createReducer(
  initialState,
  on(ShoppingCartAction.addProduct, (state, action) => {
    const existingProduct = state.products.find(p => p.product.id === action.product.product.id);
    
    if (existingProduct) {
      const updatedProducts = state.products.map(p =>
        p.product.id === action.product.product.id ? { ...p, quantity: p.quantity + 1, subTotal: (p.quantity + 1) * p.product.price } : p
      );
      return {
        ...state,
        products: updatedProducts,
        total: state.total + action.product.product.price
      };
    } else {
      return {
        ...state,
        products: [...state.products, { ...action.product, quantity: action.product.quantity, subTotal: action.product.product.price }],
        total: state.total + (action.product.product.price * action.product.quantity)
      };
    }
  }),
  on(ShoppingCartAction.clearCart, () => initialState)
);