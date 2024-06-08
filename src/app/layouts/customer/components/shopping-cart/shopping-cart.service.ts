import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, first } from 'rxjs';
import { State } from '../../../../core/store/shopping-cart/shopping-cart.reducer';
import { ShoppingCartAction } from '../../../../core/store/shopping-cart/shopping-cart.actions';
import { OrderDetailRequest } from '../../pages/checkout/models/order-detail-request';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  cart$: Observable<State>;

  constructor(private store: Store<{ cart: State }>) {
    this.cart$ = this.store.select('cart');
  }

  ngOnInit(): void {}

  onAddProduct(orderDetail: OrderDetailRequest) {
    this.store.dispatch(ShoppingCartAction.addProduct({orderDetail}));
  }

  onRemoveProduct(productId: string) {
    this.store.dispatch(ShoppingCartAction.removeProduct({ productId }));
  }

  onUpdateProductQuantity(productId: string, quantity: number) {
    this.store.dispatch(ShoppingCartAction.updateProductQuantity({ productId, quantity }));
  }

  onClearCart() {
    this.store.dispatch(ShoppingCartAction.clearCart());
  }

  getCartState(): Observable<State> {
    return this.cart$.pipe(first());
  }
}
