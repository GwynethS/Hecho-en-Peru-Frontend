import { Component } from '@angular/core';
import { Product } from './models/product';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  displayedColumns: string[] = ['userId', 'fullName', 'gender', 'email', 'dateOfBirth', 'magicWandCore', 'role', 'actions'];

  products: Product[] = [];

  constructor(private matDialog: MatDialog) {
    this.loadProducts();
  }

  loadProducts() {  }

  ngOnInit(): void {  }

  onCreateProduct(): void {  }

  onEditProduct(product: Product) {  }

  onViewProduct(product: Product) {  }

  onDeleteProduct(data: Product) {  }
}
