import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from './models/customer';
import { environment } from '../../../../../environments/environment';
import { finalize } from 'rxjs';
import { AuthService } from '../../../customer/pages/auth/auth.service';
import { UserProfile } from '../../../customer/pages/user/pages/profile/models/user-profile';
import { LoadingService } from '../../../../core/services/loading.service';

@Injectable()
export class CustomersService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private loadingService: LoadingService,
  ) {}

  getCustomers() {
    this.loadingService.setIsLoading(true);
    return this.httpClient
      .get<Customer[]>(`${environment.apiURL}users`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getSearchCustomerById(id: string) {
    this.loadingService.setIsLoading(true);
    return this.httpClient
      .get<Customer>(`${environment.apiURL}user/${id}`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  createUser(userData: Customer) {
    return this.httpClient.post<Customer>(`${environment.apiURL}auth/register`, { ...userData });
  }

  updateUser(userProfile: UserProfile, id: string) {
    return this.httpClient.put<Customer>(`${environment.apiURL}userUpdate/${id}`, userProfile);
  }

  deleteUser(id: string) {
    return this.httpClient
      .delete(`${environment.apiURL}user/${id}`, { responseType: 'text' })
      .pipe(finalize(() => this.authService.logOut()));
  }
}
