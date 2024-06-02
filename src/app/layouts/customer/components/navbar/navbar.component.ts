import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginResponse } from '../../pages/auth/models/login-response';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../../core/store/auth/auth.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  categorySearchForm: FormGroup;
  authUser$: Observable<LoginResponse | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.categorySearchForm = this.fb.group({
      category: this.fb.control('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]*'),
      ]),
    });
    this.authUser$ = this.store.select(selectAuthUser);
  }

  onUserIcon() {
    this.authUser$.pipe(take(1)).subscribe({
      next: (data) => {
        if (data) {
          if (data.user.roles[0].nameRole === 'USER') {
            this.router.navigate(['/shop/user/profile']);
          }
        } else {
          this.router.navigate(['/shop/auth']);
        }
      },
    });
  }
}
