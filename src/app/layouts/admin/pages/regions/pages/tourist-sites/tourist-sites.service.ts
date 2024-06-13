import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TouristSite } from './models/tourist-site';
import { environment } from '../../../../../../../environments/environment';
import { catchError, of } from 'rxjs';

@Injectable()
export class TouristSitesService {
  constructor(private httpClient: HttpClient) {}

  getTouristSites() {
    return this.httpClient.get<TouristSite[]>(`${environment.apiURL}touristSites`);
  }

  getTouristSitesByRegion(regionId: string) {
    return this.httpClient.get<TouristSite[]>(`${environment.apiURL}touristSitesByRegion/${regionId}`);
  }

  addTouristSites(data: TouristSite, file: File) {
    const formData: FormData = new FormData();
    formData.append('touristSiteDTO', new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.post(`${environment.apiURL}touristSite`, formData)
    .pipe(
      catchError((err) => {
        console.error('Failed to add tourist site', err);
        return of({ err });
      })
    );
  }

  updateTouristSites(id: string, data: TouristSite, file: File) {
    const formData: FormData = new FormData();
    formData.append('touristSiteDTO', new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.put(`${environment.apiURL}touristSite/${id}`, formData)
    .pipe(
      catchError((err) => {
        console.error('Failed to update tourist site', err);
        return of({ err });
      })
    );
  }

  deleteTouristSiteByID(id: string) {
    return this.httpClient
      .delete(`${environment.apiURL}touristSite/${id}`, { responseType: 'text' })
      .pipe(
        catchError((err) => {
          console.error('Failed to delete tourist site', err);
          return of([]);
        })
      );
  }
}
