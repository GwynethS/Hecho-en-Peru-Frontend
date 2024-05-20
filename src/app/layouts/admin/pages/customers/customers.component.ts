import { Component } from '@angular/core';
import { Customer } from './models/customer';
import { CustomersService } from './customers.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../../core/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  customers: Customer[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    private customersService: CustomersService,
    private matDialog: MatDialog,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.customersService.getCustomers().subscribe({
        next: (customers) => {
          this.customers = customers;
        },
      })
    );
  }

  onViewProduct(customer: Customer) {
  }
}