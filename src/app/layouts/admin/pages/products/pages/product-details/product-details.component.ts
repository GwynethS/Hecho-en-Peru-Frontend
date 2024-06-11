import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  productSelected: Product | null = null;
  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const productId = this.activatedRoute.snapshot.paramMap.get('id');
    if (productId) {
      this.subscriptions.push(
        this.productService.getProductDetailsByID(productId).subscribe({
          next: (findedProduct) => {
            if (findedProduct) {
              this.productSelected = findedProduct;
            }
          },
          error: () => {
            this.router.navigate(['/404']);
          },
        })
      );
    } else {
      this.router.navigate(['/404']);
    }
  }

  redirectToProducts() {
    this.router.navigate([`/admin/products`]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
