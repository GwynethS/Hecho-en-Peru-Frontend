import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectShoppingCartProducts,
  selectShoppingCartTotal,
} from '../../../../core/store/shopping-cart/shopping-cart.selector';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShoppingCartService } from '../../components/shopping-cart/shopping-cart.service';
import { Router } from '@angular/router';
import { OrderDetailRequest } from './models/order-detail-request';
import { OrderService } from './order.service';
import { LoginResponse } from '../auth/models/login-response';
import { selectAuthUser } from '../../../../core/store/auth/auth.selectors';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  paymentForm: FormGroup;
  authUser$: Observable<LoginResponse | null>;
  cartProducts$: Observable<OrderDetailRequest[]>;
  cartTotal$: Observable<number>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      telefono: this.fb.control('', [
        Validators.required,
        Validators.pattern('^\\d{9}$'),
      ]),
      codigo: this.fb.control('', [
        Validators.required,
        Validators.pattern('^\\d{6}$'),
      ]),
    });
    
    this.authUser$ = this.store.select(selectAuthUser);
    this.cartProducts$ = this.store.select(selectShoppingCartProducts);
    this.cartTotal$ = this.store.select(selectShoppingCartTotal);
  }

  onSubmit() {
    const user: LoginResponse | null = this.authService.getAuthUser();
    user?.user
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
    } else {
      if(user){
        this.shoppingCartService.getCartState().subscribe({
          next: (state) => {
            this.orderService.createOrder({...state, user : user.user }).subscribe({
              next: () => {
                this.shoppingCartService.onClearCart();
                this.router.navigate(["/shop"]);
              }
            })
          }
        })
      }
    }
  }
}
