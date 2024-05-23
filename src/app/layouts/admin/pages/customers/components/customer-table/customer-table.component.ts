import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Customer } from '../../models/customer';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.scss',
})
export class CustomerTableComponent {
  @Input()
  dataSource!: MatTableDataSource<Customer>;

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

  constructor() {}
}
