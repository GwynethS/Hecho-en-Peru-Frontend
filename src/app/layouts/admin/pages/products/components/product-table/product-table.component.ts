import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss'
})
export class ProductTableComponent {
  @Input()
  dataSource: Product[] = [];

  @Output()
  editProduct = new EventEmitter<Product>();

  @Output()
  deleteProduct = new EventEmitter<Product>();

  displayedColumns: string[] = ['productId', 'name', 'category_name', 'region_name', 'localCraftsman_fullname', 'price', 'stock', 'average_rating', 'enable', 'actions'];

  constructor() {}
}
