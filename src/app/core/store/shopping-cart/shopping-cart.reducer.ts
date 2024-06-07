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
        p.product.id === action.product.product.id ? { ...p, quantity: p.quantity + action.product.quantity, subTotal: (p.quantity + action.product.quantity) * p.product.price } : p
      );
      return {
        ...state,
        products: updatedProducts,
        total: state.total + (action.product.product.price * action.product.quantity)
      };
    } else {
      return {
        ...state,
        products: [...state.products, { ...action.product, quantity: action.product.quantity, subTotal: (action.product.product.price * action.product.quantity) }],
        total: state.total + (action.product.product.price * action.product.quantity)
      };
    }
  }),
  on(ShoppingCartAction.removeProduct, (state, action) => {
    const productToRemove = state.products.find(p => p.product.id === action.productId);
    
    if (!productToRemove) return state;

    const updatedProducts = state.products.filter(p => p.product.id !== action.productId);
    
    return {
      ...state,
      products: updatedProducts,
      total: state.total - (productToRemove.subTotal || 0)
    };
  }),
  on(ShoppingCartAction.updateProductQuantity, (state, action) => {
    const updatedProducts = state.products.map(p =>
      p.product.id === action.productId ? { ...p, quantity: action.quantity , subTotal: action.quantity * p.product.price } : p
    );

    const newTotal = updatedProducts.reduce((acc, curr) => acc + (curr.subTotal || 0), 0);
    return {
      ...state,
      products: updatedProducts,
      total: newTotal
    };
  }),
  on(ShoppingCartAction.clearCart, () => initialState)
);