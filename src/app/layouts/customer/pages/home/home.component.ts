import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../admin/pages/products/models/product';
import { ProductsService } from '../../../admin/pages/products/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  length = 0;
  pageSize = 3;
  pageIndex = 0;

  products: Product[] = [];
  subscriptions: Subscription[] = [];

  constructor(private router: Router, private productsService: ProductsService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.productsService.getBestSellingProductsUser().subscribe({
        next: (products) => {
          this.length = products.length;
        },
      })
    );

    this.getProductsByPage();
  }

  getProductsByPage(){
    this.subscriptions.push(
      this.productsService
        .getBestSellingProductsByPageUser(this.pageIndex, this.pageSize)
        .subscribe({
          next: (products) => {
            this.products = products;
          },
        })
    );
  }

  previousPage(){
    if(this.pageIndex > 0){
      this.pageIndex--;
      this.getProductsByPage();
    }
  }

  nextPage(){
    if(this.pageIndex < Math.ceil(this.length / this.pageSize) - 1){
      this.pageIndex++;
      this.getProductsByPage();
    }
  }

  redirectTo(page: string): void {
    this.router.navigate([`/shop/${page}`]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }
}
