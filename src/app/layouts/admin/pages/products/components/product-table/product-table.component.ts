import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Product } from '../../models/product';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrl:'./product-table.component.scss',
})
export class ProductTableComponent implements AfterViewInit {
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
    'category',
    'region',
    'localCraftsman',
    'price',
    'stock',
    'averageRating',
    'availability',
    'enabled',
    'actions',
  ];

  _dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    if (this.paginator) {
      this._dataSource.paginator = this.paginator;
    }
  }

  onViewProductDetails(id: string) {
    this.router.navigate([`/admin/products/${id}`]);
  }
}
