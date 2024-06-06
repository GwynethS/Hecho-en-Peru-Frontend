import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './models/product';
import { Observable, catchError, mergeMap, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Category } from './models/category';
import { LocalCraftsman } from '../local-craftsmen/models/local-craftsman';
import { ProductRequest } from './models/product-request';

@Injectable()
export class ProductsService {
  constructor(private httpClient: HttpClient) { }

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

  getBestSellingProductsByPageUser(offSet: number, limit: number){
    return this.httpClient.get<Product[]>(`${environment.apiURL}bestSellingProductsByPage?offset=${offSet}&limit=${limit}`);
  }

  getProductDetailsByID(id: string) {
    return this.httpClient.get<Product[]>(`${environment.apiURL}productDetails/${id}`);
  }

  getSearchProductDetailsByID(id: string) {
    return this.httpClient.get<Product>(`${environment.apiURL}productDetails/${id}`);
  }

  deleteProductsByID(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiURL}productDelete/${id}`, { responseType: 'text' })
      .pipe(catchError((error) => {console.error('Failed to delete product', error); return of([])}));
  }

  addProducts(data: ProductRequest, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('productDTO', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.post(`${environment.apiURL}product`, formData)
      .pipe(
        catchError((error) => {
          console.error('Failed to add product', error);
          return of({ error });
        })
      );
  }

  updateProducts(id: string, data: any, file?: File): Observable<Product> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file) {
      formData.append('file', file, file.name);
    } else {
      formData.append('file', new Blob(), ''); 
    }
    return this.httpClient.put<Product>(`${environment.apiURL}product/${id}`, formData);
  }

  getCategories() {
    return this.httpClient.get<Category[]>(`${environment.apiURL}categories`);
  }

  getCategoriesByID(id: string) {
    console.log(id);
    return this.httpClient.get<Category>(`${environment.apiURL}category/${id}`);
  }

  addCategories(data: Category) {
    return this.httpClient.post<Category>(`${environment.apiURL}category`, data)
      .pipe(mergeMap(() => this.getCategories()));
  }
}
