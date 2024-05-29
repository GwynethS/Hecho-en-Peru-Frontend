import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegionsRoutingModule } from './regions-routing.module';
import { RegionsComponent } from './regions.component';
import { SharedModule } from 'primeng/api';
import { MaterialModule } from '../../../../shared/material/material.module';
import { RegionsService } from '../../../admin/pages/regions/regions.service';
import { RegionDetailComponent } from './pages/region-detail/region-detail.component';


@NgModule({
  declarations: [
    RegionsComponent,
    RegionDetailComponent
  ],
  imports: [
    CommonModule,
    RegionsRoutingModule,
    SharedModule,
    MaterialModule
  ],
  providers: [
    RegionsService
  ]
})
export class RegionsModule { }
