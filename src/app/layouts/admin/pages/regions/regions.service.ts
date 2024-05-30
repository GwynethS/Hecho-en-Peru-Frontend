import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Region } from './models/region';
import { environment } from '../../../../../environments/environment';
import { Observable, mergeMap, switchMap } from 'rxjs';

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

  addRegions(data: any): Observable<Region[]> {
    const formData: FormData = new FormData();
    formData.append('regionDTO', new Blob([JSON.stringify({
      name: data.name,
      history: data.history,
      sitesIntroduction: data.sitesIntroduction,
      craftsmenIntroduction: data.craftsmenIntroduction,
    })], { type: "application/json" }));
    if (data.image) {
      formData.append('image', data.image);
    }
    return this.httpClient.post<Region[]>(`${environment.apiURL}region`, formData);
  }

  updateRegions(id: string, data: Region): Observable<Region[]> {
    return this.httpClient
      .put<Region[]>(`${environment.apiURL}region/${id}`, data)
      .pipe(mergeMap(() => this.getRegions()));
  }
}
