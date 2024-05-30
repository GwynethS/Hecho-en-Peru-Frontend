import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TouristSite } from './models/touristSite';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TouristSitesService {
  constructor(private httpClient: HttpClient) {}

  getTouristSitesByRegion(regionId: string) {
    return this.httpClient.get<TouristSite[]>(`${environment.apiURL}touristSitesByRegion/${regionId}`
    );
  }

  createTouristSite(touristSite: TouristSite) {
    const formData: FormData = new FormData();
    formData.append('touristSiteDTO', new Blob([JSON.stringify(touristSite)], { type: "application/json" }));
    if (touristSite.image) {
      formData.append('file', touristSite.image);
    }
    return this.httpClient.post<TouristSite>(`${environment.apiURL}touristSite`, formData);
  }

  updateTouristSite(id: string, touristSite: TouristSite) {
    const formData: FormData = new FormData();
    formData.append('touristSiteDTO', new Blob([JSON.stringify(touristSite)], { type: "application/json" }));
    if (touristSite.image) {
      formData.append('file', touristSite.image);
    }
    return this.httpClient.put<TouristSite>(`${environment.apiURL}touristSite/${id}`, formData);
  }

  deleteTouristSite(id: string) {
    return this.httpClient.delete<void>(`${environment.apiURL}touristSite/${id}`);
  }
}
