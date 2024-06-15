import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Region } from './models/region';
import { environment } from '../../../../../environments/environment';
import { catchError, finalize, of } from 'rxjs';
import { LoadingService } from '../../../../core/services/loading.service';

@Injectable()
export class RegionsService {
  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  getRegions() {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Region[]>(`${environment.apiURL}regions`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getAllRegions() {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Region[]>(`${environment.apiURL}allRegions`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getSearchRegionByName(name: string) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Region[]>(`${environment.apiURL}regionSearch/${name}`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getSearchRegionDetailsByID(id: string) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Region[]>(`${environment.apiURL}regionDetail/${id}`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getRegionDetailsByID(id: string) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<Region>(`${environment.apiURL}regionDetail/${id}`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  addRegions(data: Region, file: File) {
    this.loadingService.setIsLoading(true);

    const formData = new FormData();
    formData.append(
      'regionDTO',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.post(`${environment.apiURL}region`, formData).pipe(
      catchError((err) => {
        console.error('Failed to add region', err);
        return of({ err });
      }),
      finalize(() => this.loadingService.setIsLoading(false))
    );
  }

  updateRegions(id: string, data: Region, file: File) {
    this.loadingService.setIsLoading(true);

    const formData = new FormData();
    formData.append(
      'regionDTO',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient
      .put(`${environment.apiURL}region/${id}`, formData)
      .pipe(
        catchError((err) => {
          console.error('Failed to update region', err);
          return of({ err });
        }),
        finalize(() => this.loadingService.setIsLoading(false))
      );
  }
}
