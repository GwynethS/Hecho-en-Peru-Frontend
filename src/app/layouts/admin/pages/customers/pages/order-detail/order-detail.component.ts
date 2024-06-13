import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Customer } from '../../models/customer';
import { OrderDetail } from './models/order-detail';
import { CustomersService } from '../../customers.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  length = 0;
  pageSize = 3;
  pageIndex = 0;
  pageEvent!: PageEvent;

  dataSourceOrder = new MatTableDataSource<OrderDetail>();
  dataSourceCustomer = new MatTableDataSource<Customer>();

  displayedColumnsOrder: string[] = [
    'id',
    'id_detail',
    'id_product',
    'product',
    'quantity',
    'sub_total',
    'date_created',
  ];

  displayedColumnsCustomer: string[] = [
    'id',
    'name',
    'lastName',
    'email',
    'name_role',
    'dateCreated',
    'enabled',
  ];

  orderSearchForm: FormGroup;
  customerSelected: Customer | null = null;

  searchAttempted = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService
  ) {
    this.orderSearchForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  ngOnInit(): void {
    const customerId = this.activatedRoute.snapshot.paramMap.get('id');
    if (customerId) {
      const customerSubscription = this.customersService
        .getSearchCustomerById(customerId)
        .subscribe({
          next: (customer) => {
            this.customerSelected = customer;
            this.dataSourceCustomer.data = [customer];
            this.loadOrders(customerId);
            this.loadOrdersByPage();
            this.searchAttempted = false;
          },
          error: (err) => {
            console.error(`Failed to load customer with ID ${customerId}`, err);
            this.searchAttempted = true;
            this.dataSourceCustomer.data = [];
          },
        });
      this.subscriptions.push(customerSubscription);
    } else {
      this.router.navigate(['/404']);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  loadOrders(customerId: string) {
    const countSubscription = this.customersService
      .getAllOrderDetailsByUserIdAdmin(customerId)
      .subscribe({
        next: (orders) => {
          this.length = orders.length;
        },
        error: (err) => {
          console.error('Failed to load order count', err);
        }
      });
      this.subscriptions.push(countSubscription);
  }

  loadOrdersByPage() {
    const customerId = this.customerSelected?.id;
    if (customerId) {
      this.customersService
        .getOrderDetailByUserIdByPageAdmin(
          customerId,
          this.pageIndex,
          this.pageSize
        )
        .subscribe({
          next: (orders) => {
            this.dataSourceOrder.data = orders;
          },
          error: (err) => {
            console.error('Failed to load orders by page', err);
            this.dataSourceOrder.data = [];
          },
        });
    } else {
      console.error('No customer selected');
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadOrdersByPage();
  }

  onSearch(): void {
    if (this.orderSearchForm.invalid) {
      this.orderSearchForm.markAllAsTouched();
      return;
    }
    const orderId = this.orderSearchForm.value.id;
    const customerId = this.activatedRoute.snapshot.paramMap.get('id');
    if (customerId && orderId) {
      const searchSubscription = this.customersService
        .getSearchOrderDetailsById(orderId, customerId)
        .subscribe({
          next: (order) => {
            this.dataSourceOrder.data = order;
            this.length = order.length;
            this.searchAttempted = false;
          },
          error: (err) => {
            console.error(`Failed to load order with ID ${orderId}`, err);
            this.dataSourceOrder.data = [];
            this.length = 0;
            this.searchAttempted = true;
          },
        });
      this.subscriptions.push(searchSubscription);
    }
  }

  onClean(): void {
    this.orderSearchForm.reset();
    this.pageIndex = 0;
    this.loadOrdersByPage();
    this.searchAttempted = false;
  }

  redirectToCustomers(): void {
    this.router.navigate(['/admin/customers']);
  }
}
