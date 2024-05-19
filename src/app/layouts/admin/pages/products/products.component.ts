import { Component } from '@angular/core';
import { Product } from './models/product';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from './products.service';
import { AlertService } from '../../../../core/alert.service';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  displayedColumns: string[] = ['productId', 'name', 'category_name', 'region_name', 'localCraftsman_fullname', 'price', 'stock', 'average_rating', 'enable', 'actions'];

  products: Product[] = [];

  constructor(private productsService: ProductsService, private matDialog: MatDialog, private alertService: AlertService) { }

  ngOnInit(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
    })
  }

  onCreateProduct(): void {
    this.matDialog
      .open(ProductDialogComponent)
      .afterClosed()
      .subscribe({
        next: (productData) => {
          if (productData) {
            this.productsService.addProducts(productData).subscribe({
              next: (products) => {
                this.products = products;
              },
            });
          }
        },
      })
  }

  onEditProduct(product: Product) { 
    this.matDialog
        .open(ProductDialogComponent, {
          data: { product: product, view: false, edit: true }
        })
        .afterClosed().subscribe({
          next: (productData) => {
            if (productData) {
              this.productsService.updateProducts(product.productId, productData).subscribe({
                next: (products) => { this.products = products; },
              });
            }
          },
        })
  }

  onViewProduct(product: Product) { 
    this.matDialog
    .open(ProductDialogComponent, {
      data: { product: product, view: true, edit: false }
    })
  }

  onDeleteProduct(data: Product) { 
    this.alertService.showConfirmDeleteAction('este producto').then((result) => {
      if (result.isConfirmed) {
          this.productsService.deleteProductsByID(data.productId).subscribe({
            next: (products) => { this.products = products;
            },
          })
      }
    });
  }
}
