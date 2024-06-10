import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Customer } from '../../models/customer';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.scss',
})
export class CustomerTableComponent implements AfterViewInit {
  @Input()
  set dataSource(dataSource: MatTableDataSource<Customer>) {
    this._dataSource = dataSource;
    if (this.paginator) {
      this._dataSource.paginator = this.paginator;
    }
  }

  get dataSource(): MatTableDataSource<Customer> {
    return this._dataSource;
  }

  @Output()
  editCustomer = new EventEmitter<Customer>();

  @Output()
  deleteCustomer = new EventEmitter<string>();

  displayedColumns: string[] = [
    'id',
    'name',
    'lastName',
    'email',
    'name_role',
    'dateCreated',
    'enabled',
    'actions',
  ];

  _dataSource = new MatTableDataSource<Customer>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    if (this.paginator) {
      this._dataSource.paginator = this.paginator;
    }
  }

  onViewOrderDetails(id: string) {
    this.router.navigate([`/admin/customers/${id}`]);
  }
}
