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

@Component({
  selector: 'app-tourist-sites',
  templateUrl: './tourist-sites.component.html',
  styleUrl: './tourist-sites.component.scss'
})
export class TouristSitesComponent implements OnInit, OnDestroy {
  pageSize = 50;
  pageIndex = 0;

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
  ) {}

  ngOnInit(): void {
    const regionId = this.activatedRoute.snapshot.paramMap.get('id');
    if (regionId) {
      this.subscriptions.push(
        this.regionsService.getRegionDetailsByID(regionId).subscribe({
          next: (findedRegion) => {
            if (findedRegion) {
              this.regionSelected = findedRegion;
              this.loadTouristSitesPage();
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

  loadTouristSitesPage(): void {
    const regionId = this.activatedRoute.snapshot.paramMap.get('id');
    const offset = this.pageIndex * this.pageSize;
    let subscription;
    if (regionId) {
      subscription = this.touristSiteService
        .getTouristSitesByRegion(regionId)
        .subscribe({
          next: (touristSites) => {
            this.touristSites = touristSites || [];
            this.dataSource.data = this.touristSites;
          },
          error: (err) => {
            this.touristSites = [];
            this.dataSource.data = this.touristSites;
            console.error('Failed to load tourist sites by region', err);
          }
        });
    } else {
      subscription = this.touristSiteService
        .getTouristSitesByPageAdmin(offset, this.pageSize)
        .subscribe({
          next: (touristSites) => {
            this.touristSites = touristSites || [];
            this.dataSource.data = this.touristSites;
          },
          error: (err) => {
            this.touristSites = [];
            this.dataSource.data = this.touristSites;
            console.error('Failed to load tourist sites', err);
          }
        });
    }
    this.subscriptions.push(subscription);
  }

  onCreateTouristSite(): void {
    this.matDialog
      .open(TouristSiteDialogComponent)
      .afterClosed()
      .subscribe(
        (result) => {
        if (result) {
          const { touristSiteData, image } = result;
          this.touristSiteService.addTouristSites(touristSiteData, image)
            .subscribe({
              next: () => this.loadTouristSitesPage(),
              error: (err) => console.error('Error adding tourist site', err)
            });
        }}
      );
  }

  onEditTouristSite(touristSite: TouristSite): void {
    this.matDialog
      .open(TouristSiteDialogComponent, { data: touristSite })
      .afterClosed()
      .subscribe({
        next: (result) => {
          if (result) {
            const { touristSiteData, image } = result;
            this.touristSiteService.updateTouristSites(touristSite.id, touristSiteData, image)
              .subscribe({
                next: () => this.loadTouristSitesPage(),
                error: (err) => console.error('Error updating tourist site', err)
              });
          }
        },
        error: (err) => console.error('Failed to open tourist site dialog', err),
      });
  }

  onDeleteTouristSite(id: string): void {
    this.alertService.showConfirmDeleteAction('este artesano')
      .then(result => {
        if (result.isConfirmed) {
          const deleteSubscription = this.touristSiteService.deleteTouristSiteByID(id)
            .subscribe({
              next: () => this.loadTouristSitesPage(),
              error: (err) => console.error('Failed to delete tourist site', err)
            });
          this.subscriptions.push(deleteSubscription);
        }
      });
  }

  redirectToRegions() {
    this.router.navigate([`/admin/regions`]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
