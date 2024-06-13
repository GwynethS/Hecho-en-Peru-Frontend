import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from './models/customer';
import { environment } from '../../../../../environments/environment';
import { finalize } from 'rxjs';
import { AuthService } from '../../../customer/pages/auth/auth.service';
import { UserProfile } from '../../../customer/pages/user/pages/profile/models/user-profile';
import { OrderDetail } from './pages/order-detail/models/order-detail';

@Injectable()
export class CustomersService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getCustomers() {
    return this.httpClient.get<Customer[]>(`${environment.apiURL}users`);
  }

  getSearchCustomerByID(id: string) {
    return this.httpClient.get<Customer>(`${environment.apiURL}user/${id}`);
  }

  getOrders() {
    return this.httpClient.get<Customer[]>(`${environment.apiURL}orders`);
  }

  getOrderDetailByUserIdByPageAdmin(customerId: string, offset: number, limit: number) {
    return this.httpClient.get<OrderDetail[]>(`${environment.apiURL}orderDetailByUserId?userId=${customerId}&offset=${offset}&limit=${limit}`);
  }

  getAllOrderDetailsByUserIAdmin(customerId: string) {
    return this.httpClient.get<OrderDetail[]>(`${environment.apiURL}allOrderDetailsByUserId?userId=${customerId}`);
  }

  getSearchOrderDetailsByID(orderId: string, userId: string) {
    return this.httpClient.get<OrderDetail[]>(`${environment.apiURL}ordersDetails?orderId=${orderId}&userId=${userId}`);
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
