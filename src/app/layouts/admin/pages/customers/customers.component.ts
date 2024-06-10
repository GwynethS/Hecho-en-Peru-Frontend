import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Customer } from './models/customer';
import { CustomersService } from './customers.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit, OnDestroy {
  pageSize = 50;
  pageIndex = 0;

  customerSearchForm: FormGroup;
  customers: Customer[] = [];
  dataSource = new MatTableDataSource<Customer>();
  searchAttempted: boolean = false;

  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
  ) {
    this.customerSearchForm = this.fb.group({
      id: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    });
  }

  ngOnInit(): void {
    this.loadCustomersPage();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadCustomersPage(): void {
    const offset = this.pageIndex * this.pageSize;
    const subscription = this.customersService.getCustomersByPageAdmin(offset, this.pageSize).subscribe({
      next: customers => {
        this.customers = customers || [];
        this.dataSource.data = this.customers;
      },
      error: err => {
        this.customers = [];
        this.dataSource.data = this.customers;
        console.error('Failed to load customers', err);
      }
    });
    this.subscriptions.push(subscription);
  }

  onSearch(): void {
    if (this.customerSearchForm.invalid) {
      this.customerSearchForm.markAllAsTouched();
    } else {
      const subscription = this.customersService.getSearchCustomerByID(this.customerSearchForm.value.id).subscribe({
        next: customer => {
            this.customers = [customer];
            this.dataSource.data = this.customers;
            this.searchAttempted = false;
        },
        error: err => {
          console.error(`Failed to load customer with ID ${this.customerSearchForm.value.id}`, err);
          this.searchAttempted = true;
          this.dataSource.data = [];
        }
      });
      this.subscriptions.push(subscription);
    }
  }

  onClean(): void {
    this.customerSearchForm.reset();
    this.pageIndex = 0;
    this.loadCustomersPage();
    this.searchAttempted = false;
  }
}
