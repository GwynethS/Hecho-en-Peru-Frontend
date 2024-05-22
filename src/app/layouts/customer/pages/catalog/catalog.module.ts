import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CatalogDetailComponent } from './pages/catalog-detail/catalog-detail.component';
import { StarRatingConfigService, StarRatingModule } from 'angular-star-rating';
import { MaterialModule } from '../../../../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StarRatingService } from './star-rating.service';


@NgModule({
  declarations: [
    CatalogComponent,
    CatalogDetailComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    StarRatingModule.forRoot()
  ],
  providers: [
    {
      provide: StarRatingConfigService, useClass: StarRatingService
    }
  ]
})
export class CatalogModule { }
