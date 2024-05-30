import { Component, OnInit } from '@angular/core';
import { TouristSite } from './models/touristSite';
import { Region } from '../../models/region';
import { ActivatedRoute } from '@angular/router';
import { TouristSitesService } from './tourist-sites.service';
import { RegionsService } from '../../regions.service';

@Component({
  selector: 'app-tourist-sites',
  templateUrl: './tourist-sites.component.html',
  styleUrl: './tourist-sites.component.scss'
})
export class TouristSitesComponent implements OnInit {
  region: Region | null = null;
  touristSites: TouristSite[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private touristSitesService: TouristSitesService,
  ) {}

  ngOnInit(): void {
    const regionId = this.route.snapshot.paramMap.get('id');
    if (regionId) {
      this.loadTouristSites(regionId);
    }
  }

  loadTouristSites(regionId: string): void {
    this.touristSitesService.getTouristSitesByRegion(regionId).subscribe({
      next: (sites) => {
        this.touristSites = sites;
      },
      error: (err) => {
        console.error('Failed to load tourist sites', err);
      }
    });
  }

  createTouristSite(): void {
  }

  editTouristSite(site: TouristSite): void {
  }

  deleteTouristSite(site: TouristSite): void {
  }
}
