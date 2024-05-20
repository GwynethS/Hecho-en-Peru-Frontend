import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.scss',
})
export class CustomerTableComponent {
  @Input()
  dataSource: Customer[] = [];

  @Output()
  editCustomer = new EventEmitter<Customer>();

  @Output()
  deleteCustomer = new EventEmitter<Customer>();

  displayedColumns: string[] = [
    'customerId',
    'name',
    'lastName',
    'email',
    'roles_nameRole',
    'dateCreated',
    'enabled',
    'actions',
  ];

  constructor() {}
}
