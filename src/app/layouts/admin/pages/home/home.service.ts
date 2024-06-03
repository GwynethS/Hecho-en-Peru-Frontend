import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Product } from '../products/models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private httpClient: HttpClient) { }

  getProductsByAverageRating(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${environment.apiURL}productsByAverageRating`);
  }

  getProductsByCategory(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${environment.apiURL}productsByCategory`);
  }

  getCommentsQuantityByRegion(): Observable<{ region: { name: string }, quantity: number }[]> {
    return this.httpClient.get<{ region: { name: string }, quantity: number }[]>(`${environment.apiURL}commentsQuantityByRegion`);
  }

  getProductsByRegion(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${environment.apiURL}productsByRegion`);
  }
}
