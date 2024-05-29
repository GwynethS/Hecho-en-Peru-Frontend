import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Product } from '../../models/product';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent {
  @Input()
  set dataSource(dataSource: MatTableDataSource<Product>) {
    this._dataSource = dataSource;
    if (this.paginator) {
      this._dataSource.paginator = this.paginator;
    }
  }

  get dataSource(): MatTableDataSource<Product> {
    return this._dataSource;
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

  ngAfterViewInit() {
    if (this.paginator) {
      this._dataSource.paginator = this.paginator;
    }
  }
}
