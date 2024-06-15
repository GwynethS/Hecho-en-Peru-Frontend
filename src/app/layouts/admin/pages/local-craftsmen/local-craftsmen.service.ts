import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalCraftsman } from './models/local-craftsman';
import { environment } from '../../../../../environments/environment';
import { catchError, finalize, of } from 'rxjs';
import { LocalCraftsmanRequest } from './models/local-craftsman-request';
import { LoadingService } from '../../../../core/services/loading.service';

@Injectable()
export class LocalCraftsmenService {
  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  getAllLocalCraftsmen() {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<LocalCraftsman[]>(`${environment.apiURL}AllLocalCraftsmen`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getSearchLocalCraftsmanDetailsByID(id: string) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<LocalCraftsman>(`${environment.apiURL}localCraftsmanDetail/${id}`)
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  getlocalCraftsmenByRegion(regionId: string) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .get<LocalCraftsman[]>(
        `${environment.apiURL}localCraftsmenByRegion/${regionId}`
      )
      .pipe(finalize(() => this.loadingService.setIsLoading(false)));
  }

  addLocalCraftsmen(data: LocalCraftsmanRequest, file: File) {
    this.loadingService.setIsLoading(true);

    const formData = new FormData();
    formData.append(
      'localCraftsmanDTO',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient
      .post(`${environment.apiURL}localCraftsman`, formData)
      .pipe(
        catchError((err) => {
          console.error('Failed to add local craftsman', err);
          return of({ err });
        }),
        finalize(() => this.loadingService.setIsLoading(false))
      );
  }

  updateLocalCraftsmen(id: string, data: LocalCraftsmanRequest, file: File) {
    this.loadingService.setIsLoading(true);

    const formData = new FormData();
    formData.append(
      'localCraftsmanDTO',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.httpClient
      .put(`${environment.apiURL}localCraftsman/${id}`, formData)
      .pipe(
        catchError((err) => {
          console.error('Failed to update local craftsman', err);
          return of({ err });
        }),
        finalize(() => this.loadingService.setIsLoading(false))
      );
  }

  deleteLocalCraftsmenByID(id: string) {
    this.loadingService.setIsLoading(true);

    return this.httpClient
      .delete(`${environment.apiURL}localCraftsmanDelete/${id}`, {
        responseType: 'text',
      })
      .pipe(
        catchError((err) => {
          console.error('Failed to delete local craftsman', err);
          return of([]);
        }),
        finalize(() => this.loadingService.setIsLoading(false))
      );
  }
}
