import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
})
export class ProductTableComponent {
  @Input()
  dataSource: Product[] = [];

  @Output()
  editProduct = new EventEmitter<Product>();

  @Output()
  deleteProduct = new EventEmitter<string>();

  displayedColumns: string[] = [
    'id',
    'name',
    'category_name',
    'region_name',
    'localCraftsman_fullname',
    'price',
    'stock',
    'averageRating',
    'enable',
    'actions',
  ];

  constructor() {}
}
