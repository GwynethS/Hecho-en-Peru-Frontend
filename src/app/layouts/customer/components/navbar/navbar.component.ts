import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginResponse } from '../../pages/auth/models/login-response';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../../core/store/auth/auth.selectors';
import { Router } from '@angular/router';
import { AuthService } from '../../pages/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  categorySearchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private authService: AuthService
  ) {
    this.categorySearchForm = this.fb.group({
      category: this.fb.control('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]*'),
      ]),
    });
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
}
