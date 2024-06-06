import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../pages/auth/auth.service';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../pages/auth/models/login-response';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../../core/store/auth/auth.selectors';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  authUser$: Observable<LoginResponse | null>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store,
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

  onLogOut(){
    this.authService.logOut();
  }
}
