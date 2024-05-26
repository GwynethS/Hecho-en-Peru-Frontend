import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegionsRoutingModule } from './regions-routing.module';
import { RegionsComponent } from './regions.component';
import { SharedModule } from 'primeng/api';
import { MaterialModule } from '../../../../shared/material/material.module';
import { RegionsService } from '../../../admin/pages/regions/regions.service';


@NgModule({
  declarations: [
    RegionsComponent
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
