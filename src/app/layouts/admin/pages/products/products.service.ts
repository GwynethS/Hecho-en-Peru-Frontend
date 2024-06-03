import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './models/product';
import { Observable, catchError, mergeMap, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Category } from './models/category';
import { LocalCraftsman } from '../local-craftsmen/models/localCraftsman';

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

  addProducts(data: any, file?: File) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.post<Product>(`${environment.apiURL}product`, formData)
      .pipe(mergeMap(() => this.getProducts()));
  }

  updateProducts(id: string, data: any, file?: File) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.put<Product>(`${environment.apiURL}product/${id}`, formData)
      .pipe(mergeMap(() => this.getProducts()));
  }

  getCategories() {
    return this.httpClient.get<Category[]>(`${environment.apiURL}categories`);
  }

  addCategories(data: Category, file?: File) {
    return this.httpClient.post<Category>(`${environment.apiURL}category`, data)
      .pipe(mergeMap(() => this.getCategories()));
  }

  getLocalCraftsmen() {
    return this.httpClient.get<LocalCraftsman[]>(`${environment.apiURL}localCraftsmen`);
  }

  getRegions() {
    return this.httpClient.get<any[]>(`${environment.apiURL}regions`);
  }
}
