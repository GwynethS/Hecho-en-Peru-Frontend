import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegionsRoutingModule } from './regions-routing.module';
import { RegionsComponent } from './regions.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegionTableComponent } from './components/region-table/region-table.component';
import { RegionDialogComponent } from './components/region-dialog/region-dialog.component';
import { RegionsService } from './regions.service';
import { TouristSitesComponent } from './pages/tourist-sites/tourist-sites.component';
import { TouristSitesService } from './pages/tourist-sites/tourist-sites.service';
import { TouristSiteTableComponent } from './pages/tourist-sites/components/tourist-site-table/tourist-site-table.component';
import { TouristSiteDialogComponent } from './pages/tourist-sites/components/tourist-site-dialog/tourist-site-dialog.component';


@NgModule({
  declarations: [
    RegionsComponent,
    RegionTableComponent,
    RegionDialogComponent,
    TouristSitesComponent,
    TouristSiteTableComponent,
    TouristSiteDialogComponent,
  ],
  imports: [
    CommonModule,
    RegionsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    RegionsService,
    TouristSitesService
  ],
})
export class RegionsModule {}
