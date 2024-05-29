import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegionsComponent } from './regions.component';
import { RegionDetailComponent } from './pages/region-detail/region-detail.component';

const routes: Routes = [
  {
    path: '',
    component: RegionsComponent
  },
  {
    path: ':id',
    component: RegionDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionsRoutingModule { }
