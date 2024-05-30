import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Region } from './models/region';
import { MatDialog } from '@angular/material/dialog';
import { RegionsService } from './regions.service';
import { RegionDialogComponent } from './components/region-dialog/region-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss'],
})
export class RegionsComponent implements OnInit, OnDestroy {
  pageSize = 50;
  pageIndex = 0;

  regionSearchForm: FormGroup;
  regions: Region[] = [];
  dataSource = new MatTableDataSource<Region>();
  searchAttempted = false;

  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private regionsService: RegionsService,
    private matDialog: MatDialog
  ) {
    this.regionSearchForm = this.fb.group({
      name: this.fb.control('', [
        Validators.required,
        Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚñÑ]*'),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadRegionsPage();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  loadRegionsPage(): void {
    const offset = this.pageIndex * this.pageSize;
    const subscription = this.regionsService.getRegionsByPageAdmin(offset, this.pageSize).subscribe({
      next: regions => {
        this.regions = regions || [];
        this.dataSource.data = this.regions;
      },
      error: err => {
        this.regions = [];
        this.dataSource.data = this.regions;
        console.error('Failed to load regions', err);
      }
    });
    this.subscriptions.push(subscription);
  }

  onSearch(): void {
    if (this.regionSearchForm.invalid) {
      this.regionSearchForm.markAllAsTouched();
    } else {
      const subscription = this.regionsService.getSearchRegionByName(this.regionSearchForm.value.name).subscribe({
        next: (region: Region[]) => {
          this.regions = region;
          this.dataSource.data = this.regions;
        },
        error: err => {
          console.error(`Failed to load region with name ${this.regionSearchForm.value.name}`, err);
          this.searchAttempted = true;
          this.dataSource.data = [];
        }
      });
      this.subscriptions.push(subscription);
    }
  }

  onClean(): void {
    this.regionSearchForm.reset();
    this.pageIndex = 0;
    this.loadRegionsPage();
  }

  onCreateRegion(): void {
    this.subscriptions.push(
      this.matDialog
        .open(RegionDialogComponent)
        .afterClosed()
        .subscribe((regionData) => {
          if (regionData) {
            this.regionsService.addRegions(regionData).subscribe({
              next: (regions) => {
                this.regions = regions;
              },
              error: (err) => {
                console.error('Failed to add region', err);
              },
            });
          }
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
                .updateRegions(region.id, regionData)
                .subscribe({
                  next: (regions) => {
                    this.regions = regions;
                    this.dataSource.data = this.regions;
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
