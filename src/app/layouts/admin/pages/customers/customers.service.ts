import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from './models/customer';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class CustomersService {
  constructor(private httpClient: HttpClient) { }

  getCustomers() {
    return this.httpClient.get<Customer[]>(`${environment.apiURL}users`);
  }

  getSearchCustomerByID(id: string) {
    return this.httpClient.get<Customer[]>(`${environment.apiURL}user/${id}`);
  }

  getOrders() {
    return this.httpClient.get<Customer[]>(`${environment.apiURL}orders`);
  }

  getSearchOrderDetailsByID(orderId: string, userId: string) {
    return this.httpClient.get<Customer[]>(`${environment.apiURL}ordersDetails?orderId=${orderId}&userId=${userId}`);
  }
}