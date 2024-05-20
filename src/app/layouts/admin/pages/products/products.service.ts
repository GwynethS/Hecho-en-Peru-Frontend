import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './models/product';
import { Observable, mergeMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class ProductsService {
  constructor(private httpClient: HttpClient) {}

  getProducts() {
    return this.httpClient.get<Product[]>(`${environment.apiURL}products`);
  }

  getProductDetailsByID(id: string) {
    return this.httpClient.get<Product[]>(
      `${environment.apiURL}productDetails/${id}`
    );
  }

  getSearchProductDetailsByID(id: string) {
    return this.httpClient.get<Product[]>(
      `${environment.apiURL}productDetails/${id}`
    );
  }

  deleteProductsByID(id: string) {
    return this.httpClient
      .delete(`${environment.apiURL}productDelete/${id}`)
      .pipe(mergeMap(() => this.getProducts()));
  }

  addProducts(data: Product) {
    return this.httpClient
      .post<Product>(`${environment.apiURL}product`, data)
      .pipe(mergeMap(() => this.getProducts()));
  }

  updateProducts(id: string, data: Product): Observable<Product[]> {
    return this.httpClient
      .put<Product[]>(`${environment.apiURL}product/${id}`, data)
      .pipe(mergeMap(() => this.getProducts()));
  }
}
