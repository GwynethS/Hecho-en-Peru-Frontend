import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalCraftsman } from './models/local-craftsman';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class LocalCraftsmenService {
  private apiURL = `${environment.apiURL}`;

  constructor(private httpClient: HttpClient) {}

  getLocalCraftsmen(): Observable<LocalCraftsman[]> {
    return this.httpClient.get<LocalCraftsman[]>(`${this.apiURL}localCraftsmen`);
  }

  getLocalCraftsmenByPageAdmin(offset: number, limit: number): Observable<LocalCraftsman[]> {
    return this.httpClient.get<LocalCraftsman[]>(`${this.apiURL}localCraftsmenByPageModeAdmin?offset=${offset}&limit=${limit}`);
  }

  getSearchLocalCraftsmanDetailsByID(id: string): Observable<LocalCraftsman> {
    console.log(id);
    return this.httpClient.get<LocalCraftsman>(`${this.apiURL}localCraftsmanDetail/${id}`);
  }

  getlocalCraftsmenByRegion(regionId: string): Observable<LocalCraftsman[]> {
    return this.httpClient.get<LocalCraftsman[]>(`${this.apiURL}localCraftsmenByRegion/${regionId}`);
  }

  deleteLocalCraftsmenByID(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiURL}localCraftsmanDelete/${id}`);
  }

  addLocalCraftsmen(data: LocalCraftsman): Observable<LocalCraftsman> {
    return this.httpClient.post<LocalCraftsman>(`${this.apiURL}localCraftsman`, data);
  }

  updateLocalCraftsmen(id: string, data: LocalCraftsman): Observable<LocalCraftsman> {
    return this.httpClient.put<LocalCraftsman>(`${this.apiURL}localCraftsman/${id}`, data);
  }
}
