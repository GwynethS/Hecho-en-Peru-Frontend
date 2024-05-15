import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SidebarComponent } from './components/navbar/sidebar/sidebar.component';
import { ToolbarComponent } from './components/navbar/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';


@NgModule({
  declarations: [
    AdminComponent,
    SidebarComponent,
    ToolbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
