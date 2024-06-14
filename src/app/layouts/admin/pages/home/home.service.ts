import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable, finalize } from 'rxjs';
import { QuantityProductsByCategory } from './models/quantity-products-by-category';
import { QuantityProductsByRegion } from './models/quantity-products-by-region';
import { QuantityProductsByAverageRating } from './models/quantity-products-by-average-rating';
import { PercentageCommentsByRegion } from './models/percentage-comments-by-region';
import { LoadingService } from '../../../../core/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  getProductsByAverageRating(): Observable<QuantityProductsByAverageRating[]> {
    this.loadingService.setIsLoading(true);
    return this.httpClient
      .get<QuantityProductsByAverageRating[]>(
        `${environment.apiURL}productsByAverageRating`
      )
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getProductsQuantityByCategory(): Observable<QuantityProductsByCategory[]> {
    this.loadingService.setIsLoading(true);
    return this.httpClient
      .get<QuantityProductsByCategory[]>(
        `${environment.apiURL}productsQuantityByCategory`
      )
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getCommentsQuantityByRegion(): Observable<PercentageCommentsByRegion[]> {
    this.loadingService.setIsLoading(true);
    return this.httpClient
      .get<PercentageCommentsByRegion[]>(
        `${environment.apiURL}commentsQuantityByRegion`
      )
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getProductsQuantityByRegion(): Observable<QuantityProductsByRegion[]> {
    this.loadingService.setIsLoading(true);
    return this.httpClient
      .get<QuantityProductsByRegion[]>(
        `${environment.apiURL}productsQuantityByRegion`
      )
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }
}
