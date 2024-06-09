import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { authGuard } from '../../core/guards/auth.guard';
import { profileGuard } from '../../core/guards/profile.guard';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'catalog',
        loadChildren: () =>
          import('./pages/catalog/catalog.module').then((m) => m.CatalogModule),
      },
      {
        path: 'regions',
        loadChildren: () =>
          import('./pages/regions/regions.module').then((m) => m.RegionsModule),
      },
      {
        path: 'about-us',
        loadChildren: () =>
          import('./pages/about-us/about-us.module').then(
            (m) => m.AboutUsModule
          ),
      },
      {
        path: 'sign-up',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./pages/sign-up/sign-up.module').then(
            (m) => m.SignUpModule
          ),
      },
      {
        path: 'auth',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./pages/auth/auth.module').then(
            (m) => m.AuthModule
          ),
      },
      {
        path: 'user',
        canActivate: [profileGuard],
        loadChildren: () =>
          import('./pages/user/user.module').then(
            (m) => m.UserModule
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
