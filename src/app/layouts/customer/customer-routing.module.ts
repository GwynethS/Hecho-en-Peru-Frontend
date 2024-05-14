import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';

const routes: Routes = [
  // {
  //   path: 'home',
  //   loadChildren: () =>
  //     import('./pages/home/home.module').then((m) => m.HomeModule),
  // },
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full',
  // },
  // {
  //   path: 'catalog',
  //   loadChildren: () =>
  //     import('./pages/catalog/catalog.module').then((m) => m.CatalogModule),
  // },
  // {
  //   path: 'regions',
  //   loadChildren: () =>
  //     import('./pages/regions/regions.module').then((m) => m.RegionsModule),
  // },
  // {
  //   path: 'about-us',
  //   loadChildren: () =>
  //     import('./pages/about-us/about-us.module').then((m) => m.AboutUsModule),
  // }
  {
    path: '',
    component: CustomerComponent,
    children: [
      { path: 'home', loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule) },
      { path: 'catalog', loadChildren: () => import('./pages/catalog/catalog.module').then((m) => m.CatalogModule) },
      { path: 'regions', loadChildren: () => import('./pages/regions/regions.module').then((m) => m.RegionsModule) },
      { path: 'about-us', loadChildren: () => import('./pages/about-us/about-us.module').then((m) => m.AboutUsModule) },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
