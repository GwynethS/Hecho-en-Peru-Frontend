import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../layouts/customer/pages/auth/auth.service';

export const profileGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.verifyToken() ? true : router.createUrlTree(['shop', 'auth']);
};
