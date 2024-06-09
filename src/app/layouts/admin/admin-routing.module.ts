import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./pages/products/products.module').then((m) => m.ProductsModule),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./pages/customers/customers.module').then((m) => m.CustomersModule),
      },
      {
        path: 'local-craftsmen',
        loadChildren: () =>
          import('./pages/local-craftsmen/local-craftsmen.module').then((m) => m.LocalCraftsmenModule),
      },
      {
        path: 'regions',
        loadChildren: () =>
          import('./pages/regions/regions.module').then((m) => m.RegionsModule),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
