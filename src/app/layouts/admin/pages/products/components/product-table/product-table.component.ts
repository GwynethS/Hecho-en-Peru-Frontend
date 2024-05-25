import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Product } from '../../models/product';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
})
export class ProductTableComponent implements AfterViewInit {
  @Input()
  set dataSource(data: Product[]) {
    this._dataSource.data = data;
  }

  get dataSource(): Product[] {
    return this._dataSource.data;
  }

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

  _dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }
}
