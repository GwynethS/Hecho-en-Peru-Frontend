import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TouristSite } from './models/tourist-site';
import { Region } from '../../models/region';
import { ActivatedRoute, Router } from '@angular/router';
import { TouristSitesService } from './tourist-sites.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../../../../core/services/alert.service';
import { TouristSiteDialogComponent } from './components/tourist-site-dialog/tourist-site-dialog.component';
import { Subscription } from 'rxjs';
import { RegionsService } from '../../regions.service';
import { ToastService } from '../../../../../../core/services/toast.service';

@Component({
  selector: 'app-tourist-sites',
  templateUrl: './tourist-sites.component.html',
  styleUrl: './tourist-sites.component.scss'
})
export class TouristSitesComponent implements OnInit, OnDestroy {
  regionSelected: Region | null = null;
  touristSites: TouristSite[] = [];
  dataSource = new MatTableDataSource<TouristSite>();

  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private touristSiteService: TouristSitesService,
    private regionsService: RegionsService,
    private matDialog: MatDialog,
    private router: Router,
    private alertService: AlertService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    const regionId = this.activatedRoute.snapshot.paramMap.get('id');
    if (regionId) {
      this.subscriptions.push(
        this.regionsService.getRegionDetailsByID(regionId).subscribe({
          next: (findedRegion) => {
            if (findedRegion) {
              this.regionSelected = findedRegion;
              this.loadTouristSites();
            }
          },
          error: () => {
            this.router.navigate(['/404']);
          },
        })
      );
    } else {
      this.router.navigate(['/404']);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadTouristSites(): void {
    const regionId = this.activatedRoute.snapshot.paramMap.get('id');
    let subscription;
    if (regionId) {
      subscription = this.touristSiteService
        .getAllTouristSitesByRegionId(regionId)
        .subscribe({
          next: (touristSites) => {
            this.touristSites = touristSites || [];
            this.dataSource.data = this.touristSites;
          },
          error: () => {
            this.dataSource.data = [];
          }
        });
    } else {
      subscription = this.touristSiteService
        .getTouristSites()
        .subscribe({
          next: (touristSites) => {
            this.touristSites = touristSites || [];
            this.dataSource.data = this.touristSites;
          },
          error: () => {
            this.dataSource.data = [];
          },
        });
    }
    this.subscriptions.push(subscription);
  }

  onCreateTouristSite(): void {
    this.matDialog
      .open(TouristSiteDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const { touristSiteData, image } = result;
          if (this.regionSelected) {
            const touristSiteUpdate = {
              ...touristSiteData,
              region: this.regionSelected,
            };
            this.touristSiteService
              .addTouristSites(touristSiteUpdate, image)
              .subscribe({
                next: () => {
                  this.loadTouristSites(),
                  this.toastService.showToast('Se añadió el lugar turístico correctamente');
                },
              });
          }
        }
      });
  }

  onEditTouristSite(touristSite: TouristSite): void {
    this.matDialog
      .open(TouristSiteDialogComponent, { data: touristSite })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const { touristSiteData, image } = result;
          if (this.regionSelected) {
            const touristSiteUpdate = {
              ...touristSiteData,
              region: this.regionSelected,
            };
            this.touristSiteService
              .updateTouristSites(touristSite.id, touristSiteUpdate, image)
              .subscribe({
                next: () => {
                  this.loadTouristSites(),
                  this.toastService.showToast('Se actualizó el lugar turístico correctamente');
                },
              });
          }
        }
      });
  }

  onDeleteTouristSite(id: string): void {
    this.alertService.showConfirmDeleteAction('este lugar turístico')
      .then(result => {
        if (result.isConfirmed) {
          const deleteSubscription = this.touristSiteService.deleteTouristSiteByID(id)
            .subscribe({
              next: () => {
                this.loadTouristSites(),
                this.toastService.showToast("Se eliminó el lugar turístico correctamente");
              },
            });
          this.subscriptions.push(deleteSubscription);
        }
      });
  }

  redirectToRegions() {
    this.router.navigate([`/admin/regions`]);
  }
}
