import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
      this.productsService.getProducts().subscribe({
        next: (products) => {
          this.length = products.length;
          console.log(this.length);
        },
      })
    );

    this.subscriptions.push(
      this.productsService.getProductsByPageUser(this.pageIndex, this.pageSize).subscribe({
        next: (products) => {
          this.products = products;
        },
      })
    );
  }

  previousPage(){
    if(this.pageIndex > 0){
      this.pageIndex--;
      console.log(this.pageIndex);

      this.subscriptions.push(
        this.productsService.getProductsByPageUser(this.pageIndex, this.pageSize).subscribe({
          next: (products) => {
            this.products = products;
          },
        })
      );
    }
  }

  nextPage(){
    if(this.pageIndex < Math.ceil(this.length / 3.0) - 1){
      this.pageIndex++;
      console.log(this.pageIndex);

      this.subscriptions.push(
        this.productsService.getProductsByPageUser(this.pageIndex, this.pageSize).subscribe({
          next: (products) => {
            this.products = products;
          },
        })
      );
    }
  }

  redirectTo(page: string): void {
    this.router.navigate([`/shop/${page}`]);
  }
}
