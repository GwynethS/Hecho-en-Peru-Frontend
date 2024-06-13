import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectShoppingCartProducts,
  selectShoppingCartTotal,
} from '../../../../core/store/shopping-cart/shopping-cart.selector';
import { ShoppingCartAction } from '../../../../core/store/shopping-cart/shopping-cart.actions';
import { Router } from '@angular/router';
import { OrderDetailRequest } from '../../pages/checkout/models/order-detail-request';
import { LoginResponse } from '../../pages/auth/models/login-response';
import { selectAuthUser } from '../../../../core/store/auth/auth.selectors';
import { AuthService } from '../../pages/auth/auth.service';
import { CheckoutService } from '../../pages/checkout/checkout.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  apiURL = environment.apiURL;

  authUser$: Observable<LoginResponse | null>;
  cartProducts$: Observable<OrderDetailRequest[]>;
  cartTotal$: Observable<number>;

  constructor(
    private dialogRef: MatDialogRef<ShoppingCartComponent>,
    private store: Store,
    private authService: AuthService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {
    this.authUser$ = this.store.select(selectAuthUser);
    this.cartProducts$ = this.store.select(selectShoppingCartProducts);
    this.cartTotal$ = this.store.select(selectShoppingCartTotal);
  }

  onDecrementQuantity(orderDetail: OrderDetailRequest) {
    const newQuantity = orderDetail.quantity - 1;
    if (newQuantity > 0) {
      this.store.dispatch(
        ShoppingCartAction.updateProductQuantity({
          productId: orderDetail.product.id,
          quantity: newQuantity,
        })
      );
    }
  }

  onChangeInputProductQuantity(orderDetail: OrderDetailRequest, e: any) {
    const newQuantity = e.target.value;

    if (newQuantity > 0 && newQuantity <= orderDetail.product.stock) {
      this.store.dispatch(
        ShoppingCartAction.updateProductQuantity({
          productId: orderDetail.product.id,
          quantity: newQuantity,
        })
      );
    } else {
      this.store.dispatch(
        ShoppingCartAction.updateProductQuantity({
          productId: orderDetail.product.id,
          quantity: orderDetail.quantity,
        })
      );
    }
  }

  onIncrementQuantity(orderDetail: OrderDetailRequest) {
    const newQuantity = orderDetail.quantity + 1;
    if (newQuantity <= orderDetail.product.stock) {
      this.store.dispatch(
        ShoppingCartAction.updateProductQuantity({
          productId: orderDetail.product.id,
          quantity: newQuantity,
        })
      );
    }
  }

  onRemoveProduct(productId: string) {
    this.store.dispatch(ShoppingCartAction.removeProduct({ productId }));
  }

  onCloseCart() {
    this.dialogRef.close();
  }

  onCheckout() {
    const user: LoginResponse | null = this.authService.getAuthUser();
    if (user) {
      this.checkoutService.enableCheckoutAccess();
      this.router.navigate(['/shop/checkout']);
      this.dialogRef.close();
    }else{
      this.router.navigate(['/shop/auth']);
      this.dialogRef.close();
    }
  }
}
