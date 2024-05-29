import { Component } from '@angular/core';
import { Region } from '../../../../../admin/pages/regions/models/region';
import { Subscription } from 'rxjs';
import { RegionsService } from '../../../../../admin/pages/regions/regions.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-region-detail',
  templateUrl: './region-detail.component.html',
  styleUrl: './region-detail.component.scss',
})
export class RegionDetailComponent {
  regionSelected: Region | null = null;
  subscription: Subscription[] = [];

  constructor(
    private regionsService: RegionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subscription.push(
      this.regionsService
        .getRegionDetailsByID(this.route.snapshot.params['id'])
        .subscribe({
          next: (findedRegion) => {
            if (findedRegion) {
              this.regionSelected = findedRegion;
            }
          },
          error: () => {
            this.router.navigate([`/404`]);
          },
        })
    );
  }
}
