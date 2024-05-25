import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Customer } from '../../models/customer';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.scss',
})
export class CustomerTableComponent implements AfterViewInit {
  @Input()
  set dataSource(data: Customer[]) {
    this._dataSource.data = data;
  }

  get dataSource(): Customer[] {
    return this._dataSource.data;
  }

  @Output()
  editCustomer = new EventEmitter<Customer>();

  @Output()
  deleteCustomer = new EventEmitter<Customer>();

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

  constructor() {}

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }
}
