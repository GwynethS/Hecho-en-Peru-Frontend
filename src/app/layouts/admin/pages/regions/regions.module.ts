import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegionsRoutingModule } from './regions-routing.module';
import { RegionsComponent } from './regions.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegionTableComponent } from './components/region-table/region-table.component';
import { RegionDialogComponent } from './components/region-dialog/region-dialog.component';
import { RegionsService } from './regions.service';


@NgModule({
  declarations: [RegionsComponent, RegionTableComponent, RegionDialogComponent],
  imports: [
    CommonModule,
    RegionsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [RegionsService],
})
export class RegionsModule {}
