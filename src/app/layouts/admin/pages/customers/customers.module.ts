import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomersService } from './customers.service';
import { CustomerTableComponent } from './components/customer-table/customer-table.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { OrdersService } from './pages/order-detail/orders.service';


@NgModule({
  declarations: [
    CustomersComponent,
    CustomerTableComponent,
    OrderDetailComponent,
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CustomersService, OrdersService],
})
export class CustomersModule {}
