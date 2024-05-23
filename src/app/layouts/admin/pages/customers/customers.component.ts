import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customer } from './models/customer';
import { CustomersService } from './customers.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../../core/alert.service';
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

  constructor(
    private customersService: CustomersService,
    private matDialog: MatDialog,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.customerSearchForm = this.fb.group({
      id: this.fb.control('', [
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

  loadCustomerById(id: string): void {
    this.subscriptions.push(
      this.customersService.getSearchCustomerByID(id).subscribe({
        next: (customer) => {
          this.customers.data = customer ? [customer] : [];
          console.log(this.customers.data);
        },
        error: (err) => {
          this.customers.data = [];
          console.error(`Failed to load customer with ID ${id}`, err);
        }
      })
    );
  }

  onSearch(): void {
    if (this.customerSearchForm.invalid) {
      this.customerSearchForm.markAllAsTouched();
    } else {
      const id = this.customerSearchForm.value.id;
      if (id) {
        this.loadCustomerById(id);
      } else {
        this.loadAllCustomers();
      }
    }
  }

  onViewProduct(customer: Customer) { }
}
