import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TouristSite } from './models/tourist-site';
import { environment } from '../../../../../../../environments/environment';
import { catchError, finalize, of } from 'rxjs';
import { LoadingService } from '../../../../../../core/services/loading.service';

@Injectable()
export class TouristSitesService {
  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  getTouristSites() {
    this.loadingService.setIsLoading(true);
    return this.httpClient
      .get<TouristSite[]>(`${environment.apiURL}touristSites`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getAllTouristSitesByRegionId(regionId: string) {
    this.loadingService.setIsLoading(true);
    return this.httpClient
      .get<TouristSite[]>(`${environment.apiURL}allTouristSitesByRegionId?regionId=${regionId}`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getTouristSitesByRegion(regionId: string) {
    this.loadingService.setIsLoading(true);
    return this.httpClient
      .get<TouristSite[]>(`${environment.apiURL}touristSitesByRegion/${regionId}`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  addTouristSites(data: TouristSite, file: File) {
    this.loadingService.setIsLoading(true);
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
      }),
      finalize(() => this.loadingService.setIsLoading(false))
    );
  }

  updateTouristSites(id: string, data: TouristSite, file: File) {
    this.loadingService.setIsLoading(true);
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
      }),
      finalize(() => this.loadingService.setIsLoading(false))
    );
  }

  deleteTouristSiteByID(id: string) {
    this.loadingService.setIsLoading(true);
    return this.httpClient
      .delete(`${environment.apiURL}touristSite/${id}`, { responseType: 'text' })
      .pipe(
        catchError((err) => {
          console.error('Failed to delete tourist site', err);
          return of([]);
        }),
        finalize(() => this.loadingService.setIsLoading(false))
      );
  }
}
