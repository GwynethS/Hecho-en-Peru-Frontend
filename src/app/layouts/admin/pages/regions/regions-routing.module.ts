import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegionsComponent } from './regions.component';
import { TouristSitesComponent } from './pages/tourist-sites/tourist-sites.component';

const routes: Routes = [
  {
    path: '',
    component: RegionsComponent,
  },
  {
    path: ':id',
    component: TouristSitesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionsRoutingModule {}
