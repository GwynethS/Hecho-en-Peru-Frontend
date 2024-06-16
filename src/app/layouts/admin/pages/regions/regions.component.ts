import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Region } from './models/region';
import { MatDialog } from '@angular/material/dialog';
import { RegionsService } from './regions.service';
import { RegionDialogComponent } from './components/region-dialog/region-dialog.component';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ToastService } from '../../../../core/services/toast.service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrl: './regions.component.scss',
})
export class RegionsComponent implements OnInit, OnDestroy {
  regionSearchForm: FormGroup;
  regions: Region[] = [];
  dataSource = new MatTableDataSource<Region>();

  searchAttempted: boolean = false;

  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(FormGroupDirective)
  private regionSearchFormDir!: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private regionsService: RegionsService,
    private matDialog: MatDialog,
    private alertService: AlertService,
    private toastService: ToastService
  ) {
    this.regionSearchForm = this.fb.group({
      name: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$'),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadRegions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  loadRegions(): void {
    const subscription = this.regionsService.getAllRegions().subscribe({
      next: (regions) => {
        this.searchAttempted = false;
        this.regions = regions || [];
        this.dataSource.data = this.regions;
      },
      error: () => {
        this.dataSource.data = [];
        this.alertService.showError(
          'Ups! Ocurrió un error',
          'No se pudieron cargar los datos correctamente'
        );
      },
    });
    this.subscriptions.push(subscription);
  }

  onSearch(): void {
    if (this.regionSearchForm.invalid) {
      this.regionSearchForm.markAllAsTouched();
    } else {
      const subscription = this.regionsService
        .getSearchRegionByName(this.regionSearchForm.value.name)
        .subscribe({
          next: (region: Region[]) => {
            if (region.length) {
              this.searchAttempted = false;
              this.regions = region;
              this.dataSource.data = this.regions;
            } else {
              this.searchAttempted = true;
              this.dataSource.data = [];
            }
          },
          error: () => {
            this.dataSource.data = [];
            this.searchAttempted = true;
          },
        });
      this.subscriptions.push(subscription);
    }
  }

  onClean(): void {
    this.searchAttempted = false;
    this.regionSearchFormDir.resetForm();
    this.loadRegions();
  }

  onCreateRegion(): void {
    this.matDialog
      .open(RegionDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const { regionData, image } = result;
          this.regionsService.addRegions(regionData, image).subscribe({
            next: () => {
              this.loadRegions(),
                this.toastService.showToast(
                  'Se añadió la región correctamente'
                );
            },
          });
        }
      });
  }

  onEditRegion(region: Region): void {
    this.matDialog
      .open(RegionDialogComponent, { data: region })
      .afterClosed()
      .subscribe({
        next: (result) => {
          if (result) {
            const { regionData, image } = result;
            this.regionsService
              .updateRegions(region.id, regionData, image)
              .subscribe({
                next: () => {
                  this.loadRegions(),
                    this.toastService.showToast(
                      'Se actualizó la región correctamente'
                    );
                },
              });
          }
        },
      });
  }
}
