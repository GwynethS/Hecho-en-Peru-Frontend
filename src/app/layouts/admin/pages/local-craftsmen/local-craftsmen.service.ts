import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalCraftsman } from './models/local-craftsman';
import { environment } from '../../../../../environments/environment';
import { catchError, of } from 'rxjs';
import { LocalCraftsmanRequest } from './models/local-craftsman-request';

@Injectable()
export class LocalCraftsmenService {
  constructor(private httpClient: HttpClient) {}

  getLocalCraftsmen() {
    return this.httpClient.get<LocalCraftsman[]>(`${environment.apiURL}localCraftsmen`);
  }

  getSearchLocalCraftsmanDetailsByID(id: string) {
    return this.httpClient.get<LocalCraftsman>(`${environment.apiURL}localCraftsmanDetail/${id}`);
  }

  getlocalCraftsmenByRegion(regionId: string) {
    return this.httpClient.get<LocalCraftsman[]>(`${environment.apiURL}localCraftsmenByRegion/${regionId}`);
  }

  addLocalCraftsmen(data: LocalCraftsmanRequest, file: File) {
    const formData = new FormData();
    formData.append('localCraftsmanDTO', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.post(`${environment.apiURL}localCraftsman`, formData)
    .pipe(
      catchError((err) => {
        console.error('Failed to add local craftsman', err);
        return of({ err });
      })
    );
  }

  updateLocalCraftsmen(id: string, data: LocalCraftsmanRequest, file: File) {
    const formData = new FormData();
    formData.append('localCraftsmanDTO', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.put(`${environment.apiURL}localCraftsman/${id}`, formData)
      .pipe(
        catchError((err) => {
          console.error('Failed to update local craftsman', err);
          return of({ err });
        })
      );
  }

  deleteLocalCraftsmenByID(id: string) {
    return this.httpClient
      .delete(`${environment.apiURL}localCraftsmanDelete/${id}`, { responseType: 'text' })
      .pipe(
        catchError((err) => {
          console.error('Failed to delete local craftsman', err);
          return of([]);
        })
      );
  }
}
