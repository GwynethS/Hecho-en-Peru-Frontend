import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalCraftsman } from './models/localCraftsman';
import { environment } from '../../../../../environments/environment';
import { Observable, mergeMap } from 'rxjs';

@Injectable()
export class LocalCraftsmenService {
  constructor(private httpClient: HttpClient) {}

  getLocalCraftsmen() {
    return this.httpClient.get<LocalCraftsman[]>(
      `${environment.apiURL}localCraftsmen`
    );
  }

  getSearchLocalCraftsmanDetailsByID(id: string) {
    return this.httpClient.get<LocalCraftsman>(
      `${environment.apiURL}localCraftsmanDetail/${id}`
    );
  }

  getlocalCraftsmenByRegion(regionId: string) {
    return this.httpClient.get<LocalCraftsman[]>(
      `${environment.apiURL}localCraftsmenByRegion/${regionId}`
    );
  }

  deleteLocalCraftsmenByID(id: string) {
    return this.httpClient
      .delete(`${environment.apiURL}localCraftsmanDelete/${id}`)
      .pipe(mergeMap(() => this.getLocalCraftsmen()));
  }

  addLocalCraftsmen(data: LocalCraftsman) {
    return this.httpClient
      .post<LocalCraftsman>(`${environment.apiURL}localCraftsman`, data)
      .pipe(mergeMap(() => this.getLocalCraftsmen()));
  }

  updateLocalCraftsmen(
    id: string,
    data: LocalCraftsman
  ): Observable<LocalCraftsman[]> {
    return this.httpClient
      .put<LocalCraftsman[]>(`${environment.apiURL}localCraftsman/${id}`, data)
      .pipe(mergeMap(() => this.getLocalCraftsmen()));
  }
}
