import { Component, OnDestroy, OnInit } from '@angular/core';
import { Region } from './models/region';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RegionsService } from './regions.service';
import { RegionDialogComponent } from './components/region-dialog/region-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../core/alert.service';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrl: './regions.component.scss',
})
export class RegionsComponent implements OnInit, OnDestroy {
  regions: Region[] = [];
  regionSearchForm: FormGroup;
  subscriptions: Subscription[] = [];
  searchAttempted: boolean = false;

  constructor(
    private regionsService: RegionsService,
    private matDialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.regionSearchForm = this.fb.group({
      name: this.fb.control('', [
        Validators.required,
        Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚñÑ]*'),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadAllRegions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }

  loadAllRegions(): void {
    this.subscriptions.push(
      this.regionsService.getRegions().subscribe({
        next: (regions) => {
          this.regions = regions || [];
          console.log(regions);
        },
        error: (err) => {
          this.regions = [];
          console.error('Failed to load regions', err);
        }
      })
    );
  }

  onSearch(): void {
    if (this.regionSearchForm.invalid) {
      this.regionSearchForm.markAllAsTouched();
    } else {
      this.subscriptions.push(
        this.regionsService.getSearchRegionByName(this.regionSearchForm.value.name).subscribe({
          next: (regions) => {
            this.regions = regions;
            console.log(this.regions);
            this.searchAttempted = true;
          },
          error: (err) => {
            this.regions = [];
            this.searchAttempted = true;
            console.error(`Failed to load regions with name ${this.regionSearchForm.value.name}`, err);
          }
        })
      );
    }
  }

  onClean(): void {
    this.regionSearchForm.reset();
    this.loadAllRegions();
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
}
