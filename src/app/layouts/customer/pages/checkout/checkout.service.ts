import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private canActivateCheckout = false;

  enableCheckoutAccess(): void {
    this.canActivateCheckout = true;
  }

  resetCheckoutAccess(): void {
    this.canActivateCheckout = false;
  }

  getCheckoutAccess(): boolean {
    return this.canActivateCheckout;
  }
}
