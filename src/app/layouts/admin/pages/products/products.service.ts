import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './models/product';
import { catchError, finalize, mergeMap, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Category } from './models/category';
import { ProductRequest } from './models/product-request';
import { LoadingService } from '../../../../core/services/loading.service';

@Injectable()
export class ProductsService {
  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  getProducts() {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Product[]>(`${environment.apiURL}products`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getProductsAdmin() {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Product[]>(`${environment.apiURL}productsAdmin`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getProductsByPageUser(offSet: number, limit: number) {
    return this.httpClient.get<Product[]>(
      `${environment.apiURL}productsByPageModeUser?offset=${offSet}&limit=${limit}`
    );
  }

  getBestSellingProductsUser() {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Product[]>(`${environment.apiURL}listBestSellingProducts`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getBestSellingProductsByPageUser(offSet: number, limit: number) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Product[]>(
        `${environment.apiURL}bestSellingProductsByPage?offset=${offSet}&limit=${limit}`
      )
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getProductDetailsByID(id: string) {
    return this.httpClient.get<Product>(
      `${environment.apiURL}productDetails/${id}`
    );
  }

  getSearchProductDetailsByID(id: string) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Product>(`${environment.apiURL}productDetails/${id}`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  addProducts(data: ProductRequest, file: File) {
    this.loadingService.setIsLoading(true);

    const formData = new FormData();
    formData.append(
      'productDTO',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.post(`${environment.apiURL}product`, formData).pipe(
      catchError((err) => {
        console.error('Failed to add product', err);
        return of({ err });
      }),
      finalize(() => this.loadingService.setIsLoading(false))
    );
  }

  updateProducts(id: string, data: ProductRequest, file: File) {
    this.loadingService.setIsLoading(true);

    const formData = new FormData();
    formData.append(
      'productDTO',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient
      .put(`${environment.apiURL}product/${id}`, formData)
      .pipe(
        catchError((err) => {
          console.error('Failed to update product', err);
          return of({ err });
        }),
        finalize(() => this.loadingService.setIsLoading(false))
      );
  }

  deleteProductsByID(id: string) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .delete(`${environment.apiURL}productDelete/${id}`, {
        responseType: 'text',
      })
      .pipe(
        catchError((err) => {
          console.error('Failed to delete product', err);
          return of([]);
        }),
        finalize(() => this.loadingService.setIsLoading(false))
      );
  }

  getCategories() {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Category[]>(`${environment.apiURL}categories`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getCategoriesByID(id: string) {
    return this.httpClient.get<Category>(`${environment.apiURL}category/${id}`);
  }

  addCategories(data: Category) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .post<Category>(`${environment.apiURL}category`, data)
      .pipe(
        mergeMap(() => this.getCategories()),
        finalize(() => this.loadingService.setIsLoading(false))
      );
  }
}
