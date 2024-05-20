import { Component, OnDestroy } from '@angular/core';
import { Region } from './models/region';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RegionsService } from './regions.service';
import { RegionDialogComponent } from './components/region-dialog/region-dialog.component';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrl: './regions.component.scss',
})
export class RegionsComponent implements OnDestroy {
  regions: Region[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    private regionsService: RegionsService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.regionsService.getRegions().subscribe({
        next: (regions) => {
          this.regions = regions;
        },
      })
    );
  }

  onCreateRegion(): void {
    this.subscriptions.push(
      this.matDialog
        .open(RegionDialogComponent)
        .afterClosed()
        .subscribe({
          next: (regionData) => {
            if (regionData) {
              this.regionsService.addRegions(regionData).subscribe({
                next: (regions) => {
                  this.regions = regions;
                },
              });
            }
          },
        })
    );
  }

  onEditRegion(region: Region) {
    this.subscriptions.push(
      this.matDialog
        .open(RegionDialogComponent, {
          data: { region: region, view: false, edit: true },
        })
        .afterClosed()
        .subscribe({
          next: (regionData) => {
            if (regionData) {
              this.regionsService
                .updateRegions(region.regionId, regionData)
                .subscribe({
                  next: (regions) => {
                    this.regions = regions;
                  },
                });
            }
          },
        })
    );
  }

  onViewRegion(region: Region) {
    this.matDialog.open(RegionDialogComponent, {
      data: { region: region, view: true, edit: false },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }
}
