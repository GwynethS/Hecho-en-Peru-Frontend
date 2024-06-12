import { Component, OnInit, OnDestroy, ViewChild, Input, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Customer } from '../../models/customer';
import { OrderDetail } from './models/order-detail';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '../../customers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  set dataSource(dataSource: MatTableDataSource<OrderDetail>) {
    this.dataSourceOrder = dataSource;
    if (this.paginator) {
      this.dataSourceOrder.paginator = this.paginator;
    }
  }

  get dataSource(): MatTableDataSource<OrderDetail> {
    return this.dataSourceOrder;
  }

  customerSelected: Customer | null = null;

  displayedColumns: string[] = [
    'id',
    'name',
    'lastName',
    'email',
    'name_role',
    'dateCreated',
    'enabled'
  ];
  dataSourceCustomer = new MatTableDataSource<Customer>();

  displayedColumnsOrder: string[] = [
    'id',
    'id_product',
    'product',
    'quantity',
    'sub_total',
    'date_created'
  ];
  dataSourceOrder = new MatTableDataSource<OrderDetail>();

  pageSize = 50;
  pageIndex = 0;

  orderSearchForm: FormGroup;
  orders: OrderDetail[] = [];
  searchAttempted: boolean = false;

  subscriptions: Subscription[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService,
  ) {
    this.orderSearchForm = this.fb.group({
      id: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    });
  }

  ngOnInit(): void {
    const customerId = this.activatedRoute.snapshot.paramMap.get('id');
    if (customerId) {
      this.subscriptions.push(
        this.customersService.getSearchCustomerByID(customerId).subscribe({
          next: (findedCustomer) => {
            this.customerSelected = findedCustomer;
            this.dataSourceCustomer.data = [findedCustomer];
            this.loadOrdersPage();
            this.searchAttempted = false;
          },
          error: (err) => {
            console.error(`Failed to load customer with ID ${this.orderSearchForm.value.id}`, err);
            this.searchAttempted = true;
            this.dataSource.data = [];
          },
        })
      );
    } else {
      this.router.navigate(['/404']);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadOrdersPage(): void {
    const customerId = this.activatedRoute.snapshot.paramMap.get('id');
    const offset = this.pageIndex * this.pageSize;
    if (customerId) {
      const subscription = this.customersService
        .getOrderDetailByUserIdByPageAdmin(customerId, offset, this.pageSize)
        .subscribe({
          next: (orders) => {
            this.orders = orders || [];
            this.dataSourceOrder.data = this.orders;
          },
          error: (err) => {
            this.orders = [];
            this.dataSourceOrder.data = this.orders;
            console.error('Failed to load orders by customer', err);
          }
        });
      this.subscriptions.push(subscription);
    }
  }

  onSearch(): void {
    if (this.orderSearchForm.invalid) {
      this.orderSearchForm.markAllAsTouched();
    } else {
      const orderId = this.orderSearchForm.value.id;
      const customerId = this.activatedRoute.snapshot.paramMap.get('id');
      if (customerId && orderId) {
        const subscription = this.customersService.getSearchOrderDetailsByID(orderId, customerId).subscribe({
          next: order => {
            this.orders = [order];
            this.dataSourceOrder.data = this.orders;
            this.searchAttempted = false;
          },
          error: err => {
            console.error(`Failed to load order with ID ${orderId}`, err);
            this.searchAttempted = true;
            this.dataSourceOrder.data = [];
          }
        });
        this.subscriptions.push(subscription);
      }
    }
  }

  onClean(): void {
    this.orderSearchForm.reset();
    this.pageIndex = 0;
    this.loadOrdersPage();
    this.searchAttempted = false;
  }

  ngAfterViewInit() {
    this.dataSourceOrder.paginator = this.paginator;
  }

  redirectToCustomers() {
    this.router.navigate(['/admin/customers']);
  }
}
