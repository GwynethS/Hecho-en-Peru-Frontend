import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './models/product';
import { catchError, mergeMap, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Category } from './models/category';
import { ProductRequest } from './models/product-request';

@Injectable()
export class ProductsService {
  constructor(private httpClient: HttpClient) {}

  getProducts() {
    return this.httpClient.get<Product[]>(`${environment.apiURL}products`);
  }

  getProductsByPageAdmin(offset: number, limit: number) {
    return this.httpClient.get<Product[]>(`${environment.apiURL}productsByPageModeAdmin?offset=${offset}&limit=${limit}`);
  }

  getProductsByPageUser(offSet: number, limit: number) {
    return this.httpClient.get<Product[]>(`${environment.apiURL}productsByPageModeUser?offset=${offSet}&limit=${limit}`);
  }

  getBestSellingProductsUser() {
    return this.httpClient.get<Product[]>(`${environment.apiURL}listBestSellingProducts`);
  }

  getBestSellingProductsByPageUser(offSet: number, limit: number) {
    return this.httpClient.get<Product[]>(`${environment.apiURL}bestSellingProductsByPage?offset=${offSet}&limit=${limit}`);
  }

  getProductDetailsByID(id: string) {
    return this.httpClient.get<Product>(`${environment.apiURL}productDetails/${id}`);
  }

  getSearchProductDetailsByID(id: string) {
    return this.httpClient.get<Product>(`${environment.apiURL}productDetails/${id}`);
  }

  addProducts(data: ProductRequest, file: File) {
    const formData = new FormData();
    formData.append('productDTO', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.post(`${environment.apiURL}product`, formData)
    .pipe(
      catchError((err) => {
        console.error('Failed to add product', err);
        return of({ err });
      })
    );
  }

  updateProducts(id: string, data: ProductRequest, file: File) {
    const formData = new FormData();
    formData.append('productDTO', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.put(`${environment.apiURL}product/${id}`, formData)
      .pipe(
        catchError((err) => {
          console.error('Failed to update product', err);
          return of({ err });
        })
      );
  }

  deleteProductsByID(id: string) {
    return this.httpClient
      .delete(`${environment.apiURL}productDelete/${id}`, { responseType: 'text' })
      .pipe(
        catchError((err) => {
          console.error('Failed to delete product', err);
          return of([]);
        })
      );
  }

  getCategories() {
    return this.httpClient.get<Category[]>(`${environment.apiURL}categories`);
  }

  getCategoriesByID(id: string) {
    return this.httpClient.get<Category>(`${environment.apiURL}category/${id}`);
  }

  addCategories(data: Category) {
    return this.httpClient
      .post<Category>(`${environment.apiURL}category`, data)
      .pipe(mergeMap(() => this.getCategories()));
  }
}
