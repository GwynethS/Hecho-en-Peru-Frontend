import { Component } from '@angular/core';
import { Region } from '../../../../../admin/pages/regions/models/region';
import { Subscription } from 'rxjs';
import { RegionsService } from '../../../../../admin/pages/regions/regions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalCraftsman } from '../../../../../admin/pages/local-craftsmen/models/local-craftsman';
import { LocalCraftsmenService } from '../../../../../admin/pages/local-craftsmen/local-craftsmen.service';
import { TouristSite } from '../../../../../admin/pages/regions/pages/tourist-sites/models/tourist-site';
import { TouristSitesService } from '../../../../../admin/pages/regions/pages/tourist-sites/tourist-sites.service';

@Component({
  selector: 'app-region-detail',
  templateUrl: './region-detail.component.html',
  styleUrl: './region-detail.component.scss',
})
export class RegionDetailComponent {
  regionSelected: Region | null = null;
  subscription: Subscription[] = [];
  localCraftsman: LocalCraftsman[] = [];
  touristSites: TouristSite[] = [];

  constructor(
    private regionsService: RegionsService,
    private localCraftsmenService: LocalCraftsmenService,
    private touristSitesService: TouristSitesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.push(
      this.regionsService
        .getRegionDetailsByID(this.activatedRoute.snapshot.params['id'])
        .subscribe({
          next: (findedRegion) => {
            if (findedRegion) {
              this.regionSelected = findedRegion;
              this.getLocalCraftsmen();
              this.getTouristSites();
            }
          },
          error: () => {
            this.router.navigate([`/404`]);
          },
        })
    );
  }

  getLocalCraftsmen() {
    if (this.regionSelected) {
      this.subscription.push(
        this.localCraftsmenService
          .getlocalCraftsmenByRegion(this.regionSelected.id)
          .subscribe({
            next: (localCraftsmen) => {
              this.localCraftsman = localCraftsmen;
            },
          })
      );
    }
  }

  getTouristSites() {
    if(this.regionSelected) {
      this.subscription.push(
        this.touristSitesService
          .getTouristSitesByRegion(this.regionSelected.id)
          .subscribe({
            next: (touristSites) => {
              this.touristSites = touristSites;
            },
          })
      );
    }
  }
}
