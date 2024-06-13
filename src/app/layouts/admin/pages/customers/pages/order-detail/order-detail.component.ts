import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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

  pageSizeOptions: number[] = [2, 4, 8];
  pageSize = 2;
  pageIndex = 0;
  totalOrders = 0;

  orderSearchForm: FormGroup;
  searchAttempted = false;
  customerSelected: Customer | null = null;

  private subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
    this.loadCustomerAndOrders();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  loadCustomerAndOrders(): void {
    const customerId = this.activatedRoute.snapshot.paramMap.get('id');
    if (customerId) {
      const customerSubscription = this.customersService
        .getSearchCustomerByID(customerId)
        .subscribe({
          next: (customer) => {
            this.customerSelected = customer;
            this.dataSourceCustomer.data = [customer];
            this.dataSourceOrder.data = [];
            this.loadOrdersPage();
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

  loadOrdersPage(): void {
    const customerId = this.activatedRoute.snapshot.paramMap.get('id');
    const offset = this.pageIndex * this.pageSize;
    if (customerId) {
      const ordersSubscription = this.customersService
        .getOrderDetailByUserIdByPageAdmin(customerId, offset, this.pageSize)
        .subscribe({
          next: (orders) => {
            this.dataSourceOrder.data = orders || [];
            this.totalOrders = orders.length;
            if (this.paginator) {
              this.dataSourceOrder.paginator = this.paginator;
            }
          },
          error: (err) => {
            console.error('Failed to load orders by customer', err);
            this.dataSourceOrder.data = [];
          },
        });
      this.subscriptions.push(ordersSubscription);
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadOrdersPage();
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
        .getSearchOrderDetailsByID(orderId, customerId)
        .subscribe({
          next: (order) => {
            this.dataSourceOrder.data = order;
            this.totalOrders = order.length;
            if (this.paginator) {
              this.dataSourceOrder.paginator = this.paginator;
            }
            this.searchAttempted = false;
          },
          error: (err) => {
            console.error(`Failed to load order with ID ${orderId}`, err);
            this.dataSourceOrder.data = [];
            this.totalOrders = 0;
            this.searchAttempted = true;
          },
        });
      this.subscriptions.push(searchSubscription);
    }
  }

  onClean(): void {
    this.orderSearchForm.reset();
    this.pageIndex = 0;
    this.pageSize = this.totalOrders;
    this.loadOrdersPage();
    this.searchAttempted = false;
  }

  redirectToCustomers(): void {
    this.router.navigate(['/admin/customers']);
  }
}
