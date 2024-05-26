import { Component } from '@angular/core';
import { Region } from '../../../admin/pages/regions/models/region';
import { Subscription } from 'rxjs';
import { RegionsService } from '../../../admin/pages/regions/regions.service';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrl: './regions.component.scss'
})
export class RegionsComponent {
  regions: Region[] = [];
  subscription: Subscription[] = [];

  constructor(
    private regionsService: RegionsService
  ) {}

  ngOnInit(): void {
    this.subscription.push(
      this.regionsService.getRegions().subscribe({
        next: (regions) => {
          this.regions = regions;
        }
      })
    );
  }
}
