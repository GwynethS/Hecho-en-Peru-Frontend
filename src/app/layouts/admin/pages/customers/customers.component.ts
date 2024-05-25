import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Customer } from './models/customer';
import { CustomersService } from './customers.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit, OnDestroy, AfterViewInit {
  customers: Customer[] = [];
  dataSource = new MatTableDataSource<Customer>();
  customerSearchForm: FormGroup;
  subscriptions: Subscription[] = [];
  searchAttempted: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder
  ) {
    this.customerSearchForm = this.fb.group({
      id: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadAllCustomers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  loadAllCustomers(): void {
    this.subscriptions.push(
      this.customersService.getCustomers().subscribe({
        next: (customers) => {
          this.customers = customers || [];
          this.dataSource.data = this.customers;
          console.log(customers);
        },
        error: (err) => {
          this.customers = [];
          this.dataSource.data = this.customers;
          console.error('Failed to load customers', err);
        }
      })
    );
  }

  onSearch(): void {
    if (this.customerSearchForm.invalid) {
      this.customerSearchForm.markAllAsTouched();
    } else {
      this.subscriptions.push(
        this.customersService.getSearchCustomerByID(this.customerSearchForm.value.id).subscribe({
          next: (customers) => {
            this.customers = customers ? [customers] : [];
            console.log(this.customers);
            this.searchAttempted = true;
          },
          error: (err) => {
            this.customers = [];
            this.searchAttempted = true;
            console.error(`Failed to load customer with ID ${this.customerSearchForm.value.id}`, err);
          }
        })
      );
    }
  }

  onClean(): void {
    this.customerSearchForm.reset();
    this.loadAllCustomers();
  }

  onViewProduct(customer: Customer) { }
}
