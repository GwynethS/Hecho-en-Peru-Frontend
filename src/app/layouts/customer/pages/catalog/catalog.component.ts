import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Product } from '../../../admin/pages/products/models/product';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ProductsService } from '../../../admin/pages/products/products.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
  length = 0;
  pageSize = 12;
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
    if(this.pageIndex < Math.ceil(this.length / 12.0) - 1){
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
}
