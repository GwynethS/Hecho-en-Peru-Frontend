import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CatalogDetailComponent } from './pages/catalog-detail/catalog-detail.component';


@NgModule({
  declarations: [
    CatalogComponent,
    CatalogDetailComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    SharedModule
  ]
})
export class CatalogModule { }
