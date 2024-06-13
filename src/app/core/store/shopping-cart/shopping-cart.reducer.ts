import { createReducer, on } from "@ngrx/store";
import { ShoppingCartAction } from "./shopping-cart.actions";
import { OrderDetailRequest } from "../../../layouts/customer/pages/checkout/models/order-detail-request";

export const shoppingCartFeatureKey = 'cart';

export interface State {
  orderDetails: OrderDetailRequest[],
  total: number
}

export const initialState: State = {
  orderDetails: JSON.parse(localStorage.getItem('cartState') || '[]'),
  total: JSON.parse(localStorage.getItem('cartTotal') || '0'),
}

const updatelocalStorage = (state: State) => {
  localStorage.setItem('cartState', JSON.stringify(state.orderDetails));
  localStorage.setItem('cartTotal', JSON.stringify(state.total));
};

export const ShoppingCartReducer = createReducer(
  initialState,
  on(ShoppingCartAction.addProduct, (state, action) => {
    const existingProduct = state.orderDetails.find(od => od.product.id === action.orderDetail.product.id);
    let newState: State;

    if (existingProduct) {
      const updatedOrderDetails = state.orderDetails.map(od =>
        od.product.id === action.orderDetail.product.id ? { ...od, quantity: od.quantity + action.orderDetail.quantity, subTotal: (od.quantity + action.orderDetail.quantity) * od.product.price } : od
      );
      newState= {
        ...state,
        orderDetails: updatedOrderDetails,
        total: state.total + (action.orderDetail.product.price * action.orderDetail.quantity)
      };
    } else {
      newState = {
        ...state,
        orderDetails: [...state.orderDetails, { ...action.orderDetail, quantity: action.orderDetail.quantity, subTotal: (action.orderDetail.product.price * action.orderDetail.quantity) }],
        total: state.total + (action.orderDetail.product.price * action.orderDetail.quantity)
      };
    }

    updatelocalStorage(newState);
    return newState;
  }),
  on(ShoppingCartAction.removeProduct, (state, action) => {
    const productToRemove = state.orderDetails.find(od => od.product.id === action.productId);
    
    if (!productToRemove) return state;

    const updatedOrderDetails = state.orderDetails.filter(od => od.product.id !== action.productId);
    
    const newState =  {
      ...state,
      orderDetails: updatedOrderDetails,
      total: state.total - (productToRemove.subTotal || 0)
    };

    updatelocalStorage(newState);
    return newState;
  }),
  on(ShoppingCartAction.updateProductQuantity, (state, action) => {
    const updatedOrderDetails = state.orderDetails.map(od =>
      od.product.id === action.productId ? { ...od, quantity: action.quantity , subTotal: action.quantity * od.product.price } : od
    );

    const newTotal = updatedOrderDetails.reduce((acc, curr) => acc + (curr.subTotal || 0), 0);
    const newState = {
      ...state,
      orderDetails: updatedOrderDetails,
      total: newTotal
    };

    updatelocalStorage(newState);
    return newState;
  }),
  on(ShoppingCartAction.clearCart, () => {
    const newState = {
      orderDetails: [],
      total: 0
    }
    updatelocalStorage(newState);
    return newState;
  })
);