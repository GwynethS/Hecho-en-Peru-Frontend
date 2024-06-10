import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { OrderDetail } from './models/order-detail';
import { Customer } from '../../models/customer';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '../../customers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent implements AfterViewInit {
  customer: Customer | null = null;
  customerId: string | null = null;
  displayedColumns: string[] = [
    'id',
    'name',
    'lastName',
    'email',
    'name_role',
    'dateCreated',
    'enabled',
  ];
  dataSource = new MatTableDataSource<Customer>();

  @Input()
  set dataSourceOrder(dataSourceOrder: MatTableDataSource<OrderDetail>) {
    this._dataSourceOrder = dataSourceOrder;
    if (this.paginator) {
      this._dataSourceOrder.paginator = this.paginator;
    }
  }

  get dataSourceOrder(): MatTableDataSource<OrderDetail> {
    return this._dataSourceOrder;
  }

  displayedColumnsOrder: string[] = [
    'id',
    'id_product',
    'product',
    'quantity',
    'sub_total',
    'date_created',
  ];

  _dataSourceOrder = new MatTableDataSource<OrderDetail>();

  pageSize = 10;
  pageIndex = 0;

  orderSearchForm: FormGroup;
  orders: OrderDetail[] = [];
  searchAttempted: boolean = false;

  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService,
    private fb: FormBuilder,
  ) {
    this.orderSearchForm = this.fb.group({
      id: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const customerId = params.get('id');
      if (customerId) {
        this.customersService.getSearchCustomerByID(customerId).subscribe({
          next: customer => {
            this.customer = customer;
            this.customerId = customer.id;
            this.dataSource.data = [customer];
            this.loadOrdersPage();
          },
          error: err => {
            console.error('Failed to load customer details', err);
          }
        });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSourceOrder.paginator = this.paginator;
  }

  loadOrdersPage(): void {
    if (this.customerId) {
      this.customersService.getOrdersByCustomerId(this.customerId).subscribe({
        next: orders => {
          this.orders = orders || [];
          this.dataSourceOrder.data = this.orders;
        },
        error: err => {
          this.orders = [];
          this.dataSourceOrder.data = this.orders;
          console.error('Failed to load orders', err);
        }
      });
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrdersPage();
  }

  onSearch(): void {
    if (this.orderSearchForm.invalid) {
      this.orderSearchForm.markAllAsTouched();
    } else {
      const orderId = this.orderSearchForm.value.orderId;
      if (this.customerId && orderId) {
        const subscription = this.customersService.getSearchOrderDetailsByID(orderId, this.customerId).subscribe({
          next: order => {
            this.orders = [order];
            this.dataSourceOrder.data = this.orders;
          },
          error: err => {
            console.error(`Failed to load order with ID ${orderId}`, err);
            this.searchAttempted = true;
            this.dataSourceOrder.data = [];
          }
        });
      }
    }
  }

  onClean(): void {
    this.orderSearchForm.reset();
    this.pageIndex = 0;
    this.loadOrdersPage();
    this.searchAttempted = false;
  }

  redirectToCustomers() {
    this.router.navigate(['/admin/customers']);
  }
}
