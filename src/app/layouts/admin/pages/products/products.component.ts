import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ProductsService } from './products.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Product } from './models/product';
import { Category } from './models/category';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';
import { AlertService } from '../../../../core/services/alert.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  productSearchForm: FormGroup;
  products: Product[] = [];
  dataSource = new MatTableDataSource<Product>();

  categories: Category[] = [];
  dataSourceCategory = new MatTableDataSource<Category>();

  searchAttempted: boolean = false;

  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(FormGroupDirective)
  private productSearchFormDir!: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private matDialog: MatDialog,
    private alertService: AlertService,
    private toastService: ToastService,
  ) {
    this.productSearchForm = this.fb.group({
      id: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  loadProducts(): void {
    const subscription = this.productsService
      .getProductsAdmin()
      .subscribe({
        next: (products) => {
          this.searchAttempted = false;
          this.products = products || [];
          this.dataSource.data = this.products;
        },
        error: () => {
          this.dataSource.data = [];
          this.alertService.showError(
            'Ups! Ocurrió un error',
            'No se pudieron cargar los datos correctamente'
          )
        }
      });
    this.subscriptions.push(subscription);
  }

  onSearch(): void {
    if (this.productSearchForm.invalid) {
      this.productSearchForm.markAllAsTouched();
    } else {
      const subscription = this.productsService
        .getSearchProductDetailsByID(this.productSearchForm.value.id)
        .subscribe({
          next: (product) => {
            this.searchAttempted = false;
            this.products = [product];
            this.dataSource.data = this.products;
          },
          error: () => {
            this.dataSource.data = [];
            this.searchAttempted = true;
          },
        });
      this.subscriptions.push(subscription);
    }
  }

  onClean(): void {
    this.searchAttempted = false;
    this.productSearchFormDir.resetForm();
    this.loadProducts();
  }

  onCreateProduct(): void {
    this.matDialog
      .open(ProductDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const { productData, image } = result;
          this.productsService
            .addProducts(productData, image)
            .subscribe({
              next: () => {
                this.loadProducts(),
                this.toastService.showToast('Se añadió el producto correctamente');
              },
            });
        }
      });
  }

  onEditProduct(product: Product): void {
    this.matDialog
      .open(ProductDialogComponent, { data: product })
      .afterClosed()
      .subscribe({
        next: (result) => {
          if (result) {
            const { productData, image } = result;
            this.productsService
              .updateProducts(product.id, productData, image)
              .subscribe({
                next: () => {
                  this.loadProducts(),
                  this.toastService.showToast('Se actualizó el producto correctamente');
                },
              });
          }
        },
      });
  }

  onDeleteProduct(id: string): void {
    this.alertService
      .showConfirmDeleteAction('este producto')
      .then((result) => {
        if (result.isConfirmed) {
          const deleteSubscription = this.productsService
            .deleteProductsByID(id)
            .subscribe({
              next: () => {
                this.loadProducts(),
                this.toastService.showToast('Se eliminó el producto correctamente');
              },
            });
          this.subscriptions.push(deleteSubscription);
        }
      });
  }

  onCreateCategory(): void {
    const subscription = this.matDialog
      .open(CategoryDialogComponent, { data: { categories: this.categories }})
      .afterClosed()
      .subscribe({
        next: (categoryData) => {
          if (categoryData) {
            const addSubscription = this.productsService
              .addCategories(categoryData)
              .subscribe({
                next: () => {
                  this.loadCategories(),
                  this.toastService.showToast('Se añadió la categoría correctamente');
                },
              });
            this.subscriptions.push(addSubscription);
          }
        },
      });
    this.subscriptions.push(subscription);
  }

  loadCategories(): void {
    const subscription = this.productsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories || [];
        this.dataSourceCategory.data = this.categories;
      },
      error: () => {
        this.categories = [];
        this.dataSourceCategory.data = this.categories;
      },
    });
    this.subscriptions.push(subscription);
  }
}
