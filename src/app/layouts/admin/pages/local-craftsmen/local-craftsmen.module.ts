import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalCraftsmenRoutingModule } from './local-craftsmen-routing.module';
import { LocalCraftsmenComponent } from './local-craftsmen.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalCraftsmanDialogComponent } from './components/local-craftsman-dialog/local-craftsman-dialog.component';
import { LocalCraftsmanTableComponent } from './components/local-craftsman-table/local-craftsman-table.component';
import { LocalCraftsmenService } from './local-craftsmen.service';
import { RegionsService } from '../regions/regions.service';


@NgModule({
  declarations: [
    LocalCraftsmenComponent,
    LocalCraftsmanTableComponent,
    LocalCraftsmanDialogComponent,
  ],
  imports: [
    CommonModule,
    LocalCraftsmenRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LocalCraftsmenService,
    RegionsService
  ],
})
export class LocalCraftsmenModule {}
