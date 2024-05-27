import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';
import { Product } from './models/product';
import { MatDialog } from '@angular/material/dialog';
import { ProductsService } from './products.service';
import { AlertService } from '../../../../core/alert.service';
import { Subscription } from 'rxjs';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { Category } from './models/category';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy, AfterViewInit {
  products: Product[] = [];
  dataSource = new MatTableDataSource<Product>;
  categories = new MatTableDataSource<Category>;
  productSearchForm: FormGroup;
  subscriptions: Subscription[] = [];
  searchAttempted: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productsService: ProductsService,
    private matDialog: MatDialog,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.productSearchForm = this.fb.group({
      id: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadAllProducts();
    this.loadAllCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }

  loadAllCategories(): void {
    this.subscriptions.push(
      this.productsService.getCategories().subscribe({
        next: (categories) => {
          this.categories.data = categories;
          console.log(categories);
        },
        error: (err) => {
          this.categories.data = [];
          console.error('Failed to load categories', err);
        }
      })
    );
  }

  loadAllProducts(): void {
    this.subscriptions.push(
      this.productsService.getProducts().subscribe({
        next: (products) => {
          this.products = products || [];
          this.dataSource.data = this.products;
          console.log(products);
        },
        error: (err) => {
          this.products = [];
          this.dataSource.data = this.products;
          console.error('Failed to load products', err);
        }
      })
    );
  }

  onSearch(): void {
    if (this.productSearchForm.invalid) {
      this.productSearchForm.markAllAsTouched();
    } else {
      this.subscriptions.push(
        this.productsService.getSearchProductDetailsByID(this.productSearchForm.value.id).subscribe({
          next: (products) => {
            this.products = products ? [products] : [];
            console.log(this.products);
            this.searchAttempted = true;
          },
          error: (err) => {
            this.products = [];
            this.searchAttempted = true;
            console.error(`Failed to load product with ID ${this.productSearchForm.value.id}`, err);
          }
        })
      );
    }
  }

  onClean(): void {
    this.productSearchForm.reset();
    this.loadAllProducts();
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
                  this.dataSource.data = this.products;
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
                    this.dataSource.data = this.products;
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
              this.dataSource.data = this.products;
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
                  this.categories.data = categories;
                },
              });
            }
          },
        })
    );
  }
}
