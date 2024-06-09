import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CheckoutService } from '../../layouts/customer/pages/checkout/checkout.service';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const checkoutService = inject(CheckoutService);
  const router = inject(Router);

  if (checkoutService.getCheckoutAccess()) {
    checkoutService.resetCheckoutAccess(); 
    return true;
  } else {
    router.navigate(['/shop']); 
    return false;
  }
};
