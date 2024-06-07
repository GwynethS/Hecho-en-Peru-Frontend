import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { OrderDetailRequest } from '../../models/order-detail-request';
import { Store } from '@ngrx/store';
import { selectShoppingCartProducts, selectShoppingCartTotal } from '../../../../core/store/shopping-cart/shopping-cart.selector';
import { ShoppingCartAction } from '../../../../core/store/shopping-cart/shopping-cart.actions';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  cartProducts$: Observable<OrderDetailRequest[]>;
  cartTotal$: Observable<number>;
  
  constructor(private dialogRef: MatDialogRef<ShoppingCartComponent>, private store: Store){
    this.cartProducts$ = this.store.select(selectShoppingCartProducts);
    this.cartTotal$ = this.store.select(selectShoppingCartTotal);
  }

  onDecrementQuantity(orderDetail: OrderDetailRequest){
    const newQuantity = orderDetail.quantity - 1;
    if(newQuantity > 0){
      this.store.dispatch(ShoppingCartAction.updateProductQuantity({productId: orderDetail.product.id, quantity: newQuantity}))
    }
  }

  onChangeInputProductQuantity(orderDetail: OrderDetailRequest, e: any) {
    const newQuantity = e.target.value;

    if (newQuantity > 0 && newQuantity <= orderDetail.product.stock) {
      this.store.dispatch(ShoppingCartAction.updateProductQuantity({ productId: orderDetail.product.id, quantity: newQuantity }));
    } else {
      this.store.dispatch(ShoppingCartAction.updateProductQuantity({ productId: orderDetail.product.id, quantity: orderDetail.quantity }));
    }
  }

  onIncrementQuantity(orderDetail: OrderDetailRequest){
    const newQuantity = orderDetail.quantity + 1;
    if(newQuantity <= orderDetail.product.stock){
      this.store.dispatch(ShoppingCartAction.updateProductQuantity({productId: orderDetail.product.id, quantity: newQuantity}))
    }
  }

  onRemoveProduct(productId: string){
    this.store.dispatch(ShoppingCartAction.removeProduct({productId}));
  }

  onCloseCart(){
    this.dialogRef.close();
  }
}
