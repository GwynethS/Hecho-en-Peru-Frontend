import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { LocalCraftsmenService } from '../local-craftsmen/local-craftsmen.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  pageSize = 50;
  pageIndex = 0;

  productSearchForm: FormGroup;
  products: Product[] = [];
  dataSource = new MatTableDataSource<Product>();

  categories: Category[] = [];
  dataSourceCategory = new MatTableDataSource<Category>();

  searchAttempted = false;

  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private matDialog: MatDialog,
    private alertService: AlertService,
  ) {
    this.productSearchForm = this.fb.group({
      id: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadProductsPage();
    this.loadAllCategories();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  loadProductsPage(): void {
    const offset = this.pageIndex * this.pageSize;
    const subscription = this.productsService
      .getProductsByPageAdmin(offset, this.pageSize)
      .subscribe({
        next: (products) => {
          this.products = products || [];
          this.dataSource.data = this.products;
        },
        error: (err) => {
          this.products = [];
          this.dataSource.data = this.products;
          console.error('Failed to load products', err);
        },
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
            this.products = [product];
            this.dataSource.data = this.products;
          },
          error: (err) => {
            console.error(`Failed to load product with ID ${this.productSearchForm.value.id}`, err);
            this.searchAttempted = true;
            this.dataSource.data = [];
          },
        });
      this.subscriptions.push(subscription);
    }
  }

  onClean(): void {
    this.productSearchForm.reset();
    this.pageIndex = 0;
    this.loadProductsPage();
  }

  onCreateProduct(): void {
    const subscription = this.matDialog
      .open(ProductDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          const { productData, image } = result;
          this.productsService.addProducts(productData, image).subscribe(response => {
            this.loadProductsPage();
            console.log('Product added successfully', response);
          }, error => {
            console.error('Error adding product', error);
          });
        }
      });
  }

  onEditProduct(product: Product): void {
    const subscription = this.matDialog
            .open(ProductDialogComponent, { data: product })
            .afterClosed()
            .subscribe({
              next: (result) => {
                if (result) {
                  const { id, productData, image } = result;
                  this.productsService.updateProducts(productData, image).subscribe(response => {
                    this.loadProductsPage();
                    console.log('Product updated successfully', response);
                  }, error => {
                    console.error('Error updating product', error);
                  });
                }
              },
              error: (err) =>
                console.error('Failed to open product dialog', err),
            });
  }

/*   onEditProduct(product: Product): void {
    const subscription = this.productsService
      .getProductDetailsByID(product.id)
      .subscribe({
        next: (fullProduct) => {
          const editSubscription = this.matDialog
            .open(ProductDialogComponent, { data: fullProduct })
            .afterClosed()
            .subscribe({
              next: (productData) => {
                if (productData) {
                  const updateSubscription = this.productsService
                    .updateProducts(product.id, productData)
                    .subscribe({
                      next: () => this.loadProductsPage(),
                      error: (err) =>
                        console.error('Failed to update product', err),
                    });
                  this.subscriptions.push(updateSubscription);
                }
              },
              error: (err) =>
                console.error('Failed to open product dialog', err),
            });
          this.subscriptions.push(editSubscription);
        },
        error: (err) =>
          console.error(
            `Failed to load full product details with ID ${product.id}`,
            err
          ),
      });
    this.subscriptions.push(subscription);
  }
 */
  onDeleteProduct(id: string): void {
    this.alertService
      .showConfirmDeleteAction('este producto')
      .then((result) => {
        if (result.isConfirmed) {
          const subscription = this.productsService
            .deleteProductsByID(id)
            .subscribe({
              next: () => this.loadProductsPage(),
              error: (err) => console.error('Failed to delete product', err),
            });
          this.subscriptions.push(subscription);
        }
      });
  }

  onCreateCategory(): void {
    const subscription = this.matDialog
      .open(CategoryDialogComponent, {
        data: { categories: this.categories }
      })
      .afterClosed()
      .subscribe({
        next: (categoryData) => {
          if (categoryData) {
            const addSubscription = this.productsService
              .addCategories(categoryData)
              .subscribe({
                next: () => this.loadAllCategories(),
                error: (err) => console.error('Failed to add category', err),
              });
            this.subscriptions.push(addSubscription);
          }
        },
        error: (err) => console.error('Failed to open category dialog', err),
      });
    this.subscriptions.push(subscription);
  }

  loadAllCategories(): void {
    const subscription = this.productsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories || [];
        this.dataSourceCategory.data = this.categories;
      },
      error: (err) => {
        this.categories = [];
        this.dataSourceCategory.data = this.categories;
        console.error('Failed to load categories', err);
      },
    });
    this.subscriptions.push(subscription);
  }
}
