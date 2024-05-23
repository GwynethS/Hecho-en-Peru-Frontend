import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Region } from './models/region';
import { environment } from '../../../../../environments/environment';
import { Observable, mergeMap } from 'rxjs';

@Injectable()
export class RegionsService {
  constructor(private httpClient: HttpClient) {}

  getRegions() {
    return this.httpClient.get<Region[]>(`${environment.apiURL}regions`);
  }

  getSearchRegionByName(name: string) {
    return this.httpClient.get<Region>(
      `${environment.apiURL}regionSearch/${name}`
    );
  }

  getSearchRegionDetailsByID(id: string) {
    return this.httpClient.get<Region[]>(
      `${environment.apiURL}regionDetail/${id}`
    );
  }

  addRegions(data: Region) {
    return this.httpClient
      .post<Region>(`${environment.apiURL}region`, data)
      .pipe(mergeMap(() => this.getRegions()));
  }

  updateRegions(id: string, data: Region): Observable<Region[]> {
    return this.httpClient
      .put<Region[]>(`${environment.apiURL}region/${id}`, data)
      .pipe(mergeMap(() => this.getRegions()));
  }
}
