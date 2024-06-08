import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderRequest } from './models/order-request';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class OrderService {
  constructor(private httpClient: HttpClient) {}

  createOrder(orderRequest: OrderRequest) {
    console.log(orderRequest);
    return this.httpClient.post<string>(
      `${environment.apiURL}order`,
      orderRequest,
      { responseType: 'text' as 'json' }
    );
  }
}
