import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../pages/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { LoginResponse } from '../../pages/auth/models/login-response';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../../core/store/auth/auth.selectors';
import { MatDialog } from '@angular/material/dialog';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  authUser$: Observable<LoginResponse | null>;
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store,
    public dialog: MatDialog
  ) {
    this.authUser$ = this.store.select(selectAuthUser);
  }

  onUserIcon() {
    const user = this.authService.getAuthUser();
    if (user) {
      if (user.user.roles[0].nameRole === 'USER') {
        this.router.navigate(['/shop/user/profile']);
      }
    } else {
      this.router.navigate(['/shop/auth']);
    }
  }

  onShoppingCart() {
    this.dialog.open(ShoppingCartComponent);
  }

  onLogOut() {
    this.authService.logOut();
  }
}
