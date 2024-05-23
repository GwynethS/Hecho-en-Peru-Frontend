import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customer } from './models/customer';
import { CustomersService } from './customers.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit, OnDestroy {
  customers = new MatTableDataSource<Customer>();
  customerSearchForm: FormGroup;
  subscriptions: Subscription[] = [];
  searchAttempted: boolean = false;

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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadAllCustomers(): void {
    this.subscriptions.push(
      this.customersService.getCustomers().subscribe({
        next: (customers) => {
          this.customers.data = customers || [];
          console.log(customers);
        },
        error: (err) => {
          this.customers.data = [];
          console.error('Failed to load customers', err);
        }
      })
    );
  }

  onSearch(id: string): void {
    if (this.customerSearchForm.invalid) {
      this.customerSearchForm.markAllAsTouched();
    } else {
      this.subscriptions.push(
        this.customersService.getSearchCustomerByID(id).subscribe({
          next: (customer) => {
            this.customers.data = customer ? [customer] : [];
            console.log(this.customers.data);
            this.searchAttempted = true;
          },
          error: (err) => {
            this.customers.data = [];
            this.searchAttempted = true;
            console.error(`Failed to load customer with ID ${id}`, err);
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
