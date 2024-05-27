import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ProductsService } from '../../../../../admin/pages/products/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../../../admin/pages/products/models/product';
import { Comment } from './models/Comment';
import { CommentsService } from './comments.service';

@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.component.html',
  styleUrl: './catalog-detail.component.scss',
})
export class CatalogDetailComponent {
  length = 0;
  pageSize = 5;
  pageIndex = 0;

  pageEvent!: PageEvent;

  commentForm: FormGroup;

  avgRating = 4.5;

  productSelected: Product | null = null;

  comments: Comment[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private CommentsService: CommentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.commentForm = this.fb.group({
      textCommentary: this.fb.control('', Validators.required),
      rating: this.fb.control('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.productsService
        .getSearchProductDetailsByID(this.route.snapshot.params['id'])
        .subscribe({
          next: (findedProduct) => {
            if (findedProduct) {
              this.productSelected = findedProduct;
              this.avgRating = this.productSelected.averageRating;
              this.getComments();
              this.getCommentsByPage();
            }
          },
          error: () => {
            this.router.navigate([`/404`]);
          },
        })
    );
  }

  onSubmit() {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
    } else {
      console.log(this.commentForm.value);
    }
  }

  getComments() {
    if (this.productSelected) {
      this.subscriptions.push(
        this.CommentsService.getCommentsByProduct(
          this.productSelected.id
        ).subscribe({
          next: (comments) => {
            if (comments) {
              this.length = comments.length;
            }
          },
        })
      );
    }
  }

  getCommentsByPage() {
    if (this.productSelected) {
      this.subscriptions.push(
        this.CommentsService.getCommentsByPageByProduct(
          this.productSelected.id,
          this.pageIndex,
          this.pageSize
        ).subscribe({
          next: (comments) => {
            if (comments) {
              this.comments = comments;
            }
          },
        })
      );
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.getCommentsByPage();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }
}
