import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { CatalogDetailComponent } from './pages/catalog-detail/catalog-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogComponent
  },
  {
    path: ':id',
    component: CatalogDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
