import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalCraftsmenRoutingModule } from './local-craftsmen-routing.module';
import { LocalCraftsmenComponent } from './local-craftsmen.component';


@NgModule({
  declarations: [
    LocalCraftsmenComponent
  ],
  imports: [
    CommonModule,
    LocalCraftsmenRoutingModule
  ]
})
export class LocalCraftsmenModule { }
