import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TouristSite } from './models/touristSite';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TouristSitesService {
  constructor(private httpCliente: HttpClient) {}

  getTouristSitesByRegion(regionId: string) {
    return this.httpCliente.get<TouristSite[]>(
      `${environment.apiURL}touristSitesByRegion/${regionId}`
    );
  }
}
