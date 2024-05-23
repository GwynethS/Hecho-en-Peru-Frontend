import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
})
export class ProductTableComponent {
  @Input()
  dataSource!: MatTableDataSource<Product>;

  @Output()
  editProduct = new EventEmitter<Product>();

  @Output()
  deleteProduct = new EventEmitter<string>();

  displayedColumns: string[] = [
    'id',
    'name',
    'name_category',
    'name_region',
    'fullname_localCraftsman',
    'price',
    'stock',
    'averageRating',
    'enabled',
    'actions',
  ];

  constructor() {}
}
