import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserLogin } from './models/user-login';
import { AuthAction } from '../../../../core/store/auth/auth.actions';
import { environment } from '../../../../../environments/environment';

interface LoginData {
  email: null | string;
  password: null | string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUser: UserLogin | null = null;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private store: Store,
  ) {}

  private setAuthUser(user: UserLogin): void {
    this.store.dispatch(AuthAction.setAuthUser({ user }));
    localStorage.setItem('token', user.token);
  }

  logIn(data: LoginData): Observable<UserLogin[]> {
    return this.httpClient
      .get<UserLogin[]>(
        `${environment.apiURL}/users?email=${data.email}&password=${data.password}`
      )
      .pipe(
        tap((response) => {
          if (response.length) {
            this.setAuthUser(response[0]);
            this.router.navigate(['dashboard']);
          } else {
            console.log("No se pudo iniciar sesión.")
          }
        })
      );
  }

  logOut(): void {
    this.store.dispatch(AuthAction.logout());
    this.router.navigate(['auth', 'login']);
    localStorage.removeItem('token');
  }

  verifyToken() {
    return this.httpClient
      .get<UserLogin[]>(
        `${environment.apiURL}/users?token=${localStorage.getItem('token')}`
      )
      .pipe(
        map((response) => {
          if (response.length) {
            this.setAuthUser(response[0]);
            return true;
          } else {
            this.store.dispatch(AuthAction.logout());
            localStorage.removeItem('token');
            return false;
          }
        }),
        catchError(() => of(false))
      );
  }
}