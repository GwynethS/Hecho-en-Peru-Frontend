import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductsService } from './products.service';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { LocalCraftsmenService } from '../local-craftsmen/local-craftsmen.service';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductTableComponent,
    ProductDialogComponent,
    CategoryDialogComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ProductsService, LocalCraftsmenService],
})
export class ProductsModule {}
