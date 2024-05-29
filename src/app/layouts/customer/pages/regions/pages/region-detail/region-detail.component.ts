import { Component } from '@angular/core';
import { Region } from '../../../../../admin/pages/regions/models/region';
import { Subscription } from 'rxjs';
import { RegionsService } from '../../../../../admin/pages/regions/regions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalCraftsman } from '../../../../../admin/pages/local-craftsmen/models/localCraftsman';
import { LocalCraftsmenService } from '../../../../../admin/pages/local-craftsmen/local-craftsmen.service';

@Component({
  selector: 'app-region-detail',
  templateUrl: './region-detail.component.html',
  styleUrl: './region-detail.component.scss',
})
export class RegionDetailComponent {
  regionSelected: Region | null = null;
  subscription: Subscription[] = [];
  localCraftsman: LocalCraftsman[] = [];

  constructor(
    private regionsService: RegionsService,
    private localCraftsmenService: LocalCraftsmenService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.push(
      this.regionsService
        .getRegionDetailsByID(this.route.snapshot.params['id'])
        .subscribe({
          next: (findedRegion) => {
            if (findedRegion) {
              this.regionSelected = findedRegion;
              this.getLocalCraftsmen();
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
}
