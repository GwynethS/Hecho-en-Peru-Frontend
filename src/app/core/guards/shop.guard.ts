import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectAuthUser } from '../store/auth/auth.selectors';
import { AuthService } from '../../layouts/customer/pages/auth/auth.service';

export const shopGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);
  const authService = inject(AuthService);
  
  return store.select(selectAuthUser).pipe(
    map((user) => {
      if(authService.verifyToken()){
        if(user?.user.roles[0].nameRole === 'ADMIN') return router.createUrlTree(['admin']);
        else return true;
      }else{
        return true;
      }
    })
  );
};
