import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from './models/customer';
import { environment } from '../../../../../environments/environment';
import { finalize } from 'rxjs';
import { AuthService } from '../../../customer/pages/auth/auth.service';

@Injectable()
export class CustomersService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getCustomers() {
    return this.httpClient.get<Customer[]>(`${environment.apiURL}users`);
  }

  getCustomersByPageAdmin(offSet: number, limit: number) {
    return this.httpClient.get<Customer[]>(
      `${environment.apiURL}usersByPageModeAdmin?offset=${offSet}&limit=${limit}`
    );
  }

  getSearchCustomerByID(id: string) {
    return this.httpClient.get<Customer>(`${environment.apiURL}user/${id}`);
  }

  getOrders() {
    return this.httpClient.get<Customer[]>(`${environment.apiURL}orders`);
  }

  getSearchOrderDetailsByID(orderId: string, userId: string) {
    return this.httpClient.get<Customer>(
      `${environment.apiURL}ordersDetails?orderId=${orderId}&userId=${userId}`
    );
  }

  createUser(userData: Customer) {
    return this.httpClient.post<Customer>(
      `${environment.apiURL}auth/register`,
      {
        ...userData,
      }
    );
  }

  deleteUser(id: string) {
    return this.httpClient
      .delete(`${environment.apiURL}user/${id}`, { responseType: 'text' })
      .pipe(finalize(() => this.authService.logOut()));
  }
}
