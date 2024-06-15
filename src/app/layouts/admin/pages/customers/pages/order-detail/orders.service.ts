import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { OrderDetail } from './models/order-detail';
import { OrderRequest } from '../../../../../customer/pages/checkout/models/order-request';
import { finalize } from 'rxjs';
import { LoadingService } from '../../../../../../core/services/loading.service';

@Injectable()
export class OrdersService {
  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  getOrderDetailByUserIdByPageAdmin(
    customerId: string,
    offset: number,
    limit: number
  ) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<OrderDetail[]>(
        `${environment.apiURL}orderDetailByUserId?userId=${customerId}&offset=${offset}&limit=${limit}`
      )
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getAllOrderDetailsByUserIdAdmin(customerId: string) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<OrderDetail[]>(
        `${environment.apiURL}allOrderDetailsByUserId?userId=${customerId}`
      )
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getSearchOrderDetailsById(orderId: string, userId: string) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<OrderDetail[]>(
        `${environment.apiURL}ordersDetails?orderId=${orderId}&userId=${userId}`
      )
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  createOrder(orderRequest: OrderRequest) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .post<string>(`${environment.apiURL}order`, orderRequest, {
        responseType: 'text' as 'json',
      })
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }
}
