import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthAction } from '../../../../core/store/auth/auth.actions';
import { environment } from '../../../../../environments/environment';
import { LoginResponse } from './models/login-response';
import { JwtHelperService } from '@auth0/angular-jwt';

interface LoginData {
  email: null | string;
  password: null | string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUser: LoginResponse | null = null;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private store: Store,
    private jwtHelper: JwtHelperService
  ) {}

  private setAuthUser(user: LoginResponse): void {
    this.store.dispatch(AuthAction.setAuthUser({ user }));
    sessionStorage.setItem('userData', JSON.stringify(user));
  }

  logIn(data: LoginData): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${environment.apiURL}auth/login`, data)
      .pipe(
        tap((response) => {
          if (response) {
            this.setAuthUser(response);
            if (response.user.roles[0].nameRole === 'ADMIN') {
              this.router.navigate(['admin']);
            } else {
              this.router.navigate(['shop']);
            }
          }
        })
      );
  }

  logOut(): void {
    this.store.dispatch(AuthAction.logout());
    this.router.navigate(['shop', 'auth']);
    sessionStorage.removeItem('userData');
  }

  verifyToken() {
    const userDataString = sessionStorage.getItem('userData');

    if (userDataString) {
      const userData: LoginResponse = JSON.parse(userDataString);

      if (!this.jwtHelper.isTokenExpired(userData.jwtResponse.jwttoken)) {
        this.setAuthUser(userData);
        console.log("token válido");
        return true;
      } else {
        this.store.dispatch(AuthAction.logout());
        sessionStorage.removeItem('userData');
        console.log("token inválido");
        return false;
      }
    } else {
      console.log("sin token");
      return false;
    }
  }
}
