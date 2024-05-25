import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ProductsService } from '../../../../../admin/pages/products/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../../../admin/pages/products/models/product';

@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.component.html',
  styleUrl: './catalog-detail.component.scss',
})
export class CatalogDetailComponent {
  length = 50;
  pageSize = 12;
  pageIndex = 0;

  pageEvent!: PageEvent;

  commentForm: FormGroup;

  avgRating = 4.5;

  productSelected: Product | null = null;

  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subscriptions.push(
      this.productsService
        .getSearchProductDetailsByID(this.route.snapshot.params['id'])
        .subscribe({
          next: (findedProduct) => {
            if (findedProduct) {
              this.productSelected = findedProduct;
              this.avgRating = this.productSelected.averageRating;
            }
          },
          error: () => {
            this.router.navigate([`/404`]);
          }
        })
    );

    this.commentForm = this.fb.group({
      textCommentary: this.fb.control('', Validators.required),
      rating: this.fb.control('', Validators.required),
    });
  }

  onSubmit() {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
    } else {
      console.log(this.commentForm.value);
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
}
