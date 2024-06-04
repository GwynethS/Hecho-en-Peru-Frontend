import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../customer/pages/auth/auth.service';
import { Store } from '@ngrx/store';
import { LoginResponse } from '../../../customer/pages/auth/models/login-response';
import { Observable } from 'rxjs';
import { selectAuthUser } from '../../../../core/store/auth/auth.selectors';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  authUser$: Observable<LoginResponse | null>;

  @Output()
  toggleSidebar = new EventEmitter();

  constructor(private store: Store, private authService: AuthService) {
    this.authUser$ = this.store.select(selectAuthUser);
  }

  onLogOut() {
    this.authService.logOut();
  }
}
