import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./layouts/admin/admin.module').then(
        (m) => m.AdminModule
      ),
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./layouts/customer/customer.module').then(
        (m) => m.CustomerModule
      ),
  },
  {
    path: '',
    redirectTo: 'shop',
    pathMatch: 'full'
  },
  {
    path:'**',
    loadChildren: () =>
      import('./layouts/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
