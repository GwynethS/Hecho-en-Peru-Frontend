import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { MaterialModule } from '../../../../shared/material/material.module';
import { OrderService } from './order.service';


@NgModule({
  declarations: [
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    OrderService
  ]
})
export class CheckoutModule { }
