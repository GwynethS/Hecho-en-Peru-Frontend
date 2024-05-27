import { Component } from '@angular/core';
import { Product } from '../../../admin/pages/products/models/product';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ProductsService } from '../../../admin/pages/products/products.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  length = 0;
  pageSize = 12;
  pageIndex = 0;

  inputPageNumber = 1;

  products: Product[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private productsService: ProductsService
  ) {}

  getProductsByPage(){
    this.subscriptions.push(
      this.productsService
        .getProductsByPageUser(this.pageIndex, this.pageSize)
        .subscribe({
          next: (products) => {
            this.products = products;
          },
        })
    );
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.productsService.getProducts().subscribe({
        next: (products) => {
          this.length = products.length;
        },
      })
    );

    this.getProductsByPage();
  }

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;

      this.getProductsByPage();
      this.inputPageNumber = this.pageIndex + 1;
    }
  }

  changeInputPage() {
    if (
      this.inputPageNumber > 0 &&
      this.inputPageNumber <= Math.ceil(this.length / 12.0)
    ) {
      this.pageIndex = this.inputPageNumber - 1;
      this.getProductsByPage();
    }
    
    this.inputPageNumber = this.pageIndex + 1;
  }

  nextPage() {
    if (this.pageIndex < Math.ceil(this.length / 12.0) - 1) {
      this.pageIndex++;
      this.getProductsByPage();
      this.inputPageNumber = this.pageIndex + 1;
    }
  }

  redirectTo(id: string): void {
    this.router.navigate([`/shop/catalog/${id}`]);
  }
}
