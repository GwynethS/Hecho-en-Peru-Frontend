import { Component } from '@angular/core';
import { Region } from '../../../admin/pages/regions/models/region';
import { Subscription } from 'rxjs';
import { RegionsService } from '../../../admin/pages/regions/regions.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrl: './regions.component.scss',
})
export class RegionsComponent {
  regions: Region[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    private regionsService: RegionsService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.regionsService.getRegions().subscribe({
        next: (regions) => {
          this.regions = regions;
        },
        error: () =>
          this.alertService.showError(
            'Ups! Ocurrió un error',
            'No se pudieron cargar los datos correctamente'
          ),
      })
    );
  }

  redirectTo(id: string): void {
    this.router.navigate([`/shop/regions/${id}`]);
  }

  OnDestroy() {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }
}
