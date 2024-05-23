import { Component, OnDestroy } from '@angular/core';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';
import { Product } from './models/product';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from './products.service';
import { AlertService } from '../../../../core/alert.service';
import { Subscription } from 'rxjs';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { Category } from './models/category';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private productsService: ProductsService,
    private matDialog: MatDialog,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.productsService.getProducts().subscribe({
        next: (products) => {
          this.products = products;
          console.log(products);
        },
      })
    );
    this.subscriptions.push(
      this.productsService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories;
          console.log(categories);
        },
      })
    );
  }

  onCreateProduct(): void {
    this.subscriptions.push(
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
    );
  }

  onEditProduct(product: Product) {
    this.subscriptions.push(
      this.matDialog
        .open(ProductDialogComponent, {
          data: { product: product, view: true, edit: true },
        })
        .afterClosed()
        .subscribe({
          next: (productData) => {
            if (productData) {
              this.productsService
                .updateProducts(product.id, productData)
                .subscribe({
                  next: (products) => {
                    this.products = products;
                  },
                });
            }
          },
        })
    );
  }

  onViewProduct(product: Product) { }

  onDeleteProduct(id: string) {
    this.alertService
      .showConfirmDeleteAction('este producto')
      .then((result) => {
        if (result.isConfirmed) {
          this.productsService.deleteProductsByID(id).subscribe({
            next: (products) => {
              this.products = products;
            },
          });
        }
      });
  }

  onCreateCategory(): void {
    this.subscriptions.push(
      this.matDialog
        .open(CategoryDialogComponent)
        .afterClosed()
        .subscribe({
          next: (categoryData) => {
            if (categoryData) {
              this.productsService.addProducts(categoryData).subscribe({
                next: (categories) => {
                  this.categories = categories;
                },
              });
            }
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }
}
