import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Region } from './models/region';
import { environment } from '../../../../../environments/environment';
import { catchError, of } from 'rxjs';

@Injectable()
export class RegionsService {
  constructor(private httpClient: HttpClient) {}

  getRegions() {
    return this.httpClient.get<Region[]>(`${environment.apiURL}regions`);
  }

  getRegionsByPageAdmin(offset: number, limit: number) {
    return this.httpClient.get<Region[]>(`${environment.apiURL}regionsByPageAdmin?offset=${offset}&limit=${limit}`);
  }

  getSearchRegionByName(name: string) {
    return this.httpClient.get<Region[]>(`${environment.apiURL}regionSearch/${name}`);
  }

  getSearchRegionDetailsByID(id: string) {
    return this.httpClient.get<Region[]>(
      `${environment.apiURL}regionDetail/${id}`
    );
  }

  getRegionDetailsByID(id: string) {
    return this.httpClient.get<Region>(
      `${environment.apiURL}regionDetail/${id}`
    );
  }

  addRegions(data: Region, file: File) {
    const formData = new FormData();
    formData.append('regionDTO', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.post(`${environment.apiURL}region`, formData)
    .pipe(
      catchError((err) => {
        console.error('Failed to add region', err);
        return of({ err });
      })
    );
  }

  updateRegions(id: string, data: Region, file: File) {
    const formData = new FormData();
    formData.append('regionDTO', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.put(`${environment.apiURL}region/${id}`, formData)
    .pipe(
      catchError((err) => {
        console.error('Failed to update region', err);
        return of({ err });
      })
    );
  }
}
