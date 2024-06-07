import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrderDetailRequest } from '../models/order-detail-request';
import { State } from '../../../core/store/shopping-cart/shopping-cart.reducer';
import { ShoppingCartAction } from '../../../core/store/shopping-cart/shopping-cart.actions';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  cart$: Observable<State>;

  constructor(private store: Store<{ cart: State }>) {
    this.cart$ = this.store.select('cart');
  }

  ngOnInit(): void {}

  onAddProduct(product: OrderDetailRequest) {
    this.store.dispatch(ShoppingCartAction.addProduct({product}));
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
}
