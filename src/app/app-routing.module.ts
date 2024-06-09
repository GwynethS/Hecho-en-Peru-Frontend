import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { shopGuard } from './core/guards/shop.guard';
import { checkoutGuard } from './core/guards/checkout.guard';

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./layouts/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'shop',
    canActivate: [shopGuard],
    loadChildren: () =>
      import('./layouts/customer/customer.module').then(
        (m) => m.CustomerModule
      ),
  },
  {
    path: 'shop/checkout',
    canActivate: [shopGuard, checkoutGuard],
    loadChildren: () =>
      import('./layouts/customer/pages/checkout/checkout.module').then(
        (m) => m.CheckoutModule
      ),
  },
  {
    path: '',
    redirectTo: 'shop',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadChildren: () =>
      import('./layouts/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
