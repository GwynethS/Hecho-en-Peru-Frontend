import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ProductsService } from '../../../../../admin/pages/products/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../../../../../admin/pages/products/models/product';
import { Comment } from './models/comment';
import { CommentsService } from './comments.service';
import { LoginResponse } from '../../../auth/models/login-response';
import { AuthService } from '../../../auth/auth.service';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../../../../core/store/auth/auth.selectors';
import { ShoppingCartAction } from '../../../../../../core/store/shopping-cart/shopping-cart.actions';
import { OrderDetailRequest } from '../../../checkout/models/order-detail-request';
import { AlertService } from '../../../../../../core/services/alert.service';
import { ToastService } from '../../../../../../core/services/toast.service';

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

  lengthBestSellers = 0;
  pageSizeBestSellers = 4;
  pageIndexBestSellers = 0;

  inputProductQuantity: number = 1;
  avgRating = 4.5;

  productSelected: Product | null = null;

  bestSellers: Product[] = [];

  requiredRating: boolean = false;
  commentForm: FormGroup;
  comments: Comment[] = [];

  subscriptions: Subscription[] = [];
  authUser$: Observable<LoginResponse | null>;

  @ViewChild(FormGroupDirective)
  private commentFormDir!: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private productsService: ProductsService,
    private commentsService: CommentsService,
    private alertService: AlertService,
    private toastService: ToastService,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.commentForm = this.fb.group({
      textCommentary: this.fb.control('', Validators.required),
      rating: this.fb.control('', Validators.required),
    });

    this.authUser$ = this.store.select(selectAuthUser);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        const productId = params['id'];
        if (productId) {
          this.productsService
            .getSearchProductDetailsByID(productId)
            .subscribe({
              next: (findedProduct) => {
                if (findedProduct) {
                  this.productSelected = findedProduct;
                  this.avgRating = this.productSelected.averageRating;
                  this.getComments();
                  this.getCommentsByPage();
                  this.getBestSellers();
                  this.getBestSellersByPage();
                }
              },
              error: () => {
                this.router.navigate([`/404`]);
              },
            });
        }
      })
    );
  }

  updateProductData() {
    if (this.productSelected) {
      this.subscriptions.push(
        this.productsService
          .getSearchProductDetailsByID(this.productSelected.id)
          .subscribe({
            next: (findedProduct) => {
              this.productSelected = findedProduct;
              this.avgRating = this.productSelected.averageRating;
            },
            error: () =>
              this.alertService.showError(
                'Ups! Ocurrió un error',
                'No se pudieron cargar los datos correctamente'
              ),
          })
      );
    }
  }

  getBestSellers() {
    this.subscriptions.push(
      this.productsService.getBestSellingProductsUser().subscribe({
        next: (bestSellers) => {
          this.lengthBestSellers = bestSellers.length;
        },
        error: () =>
          this.alertService.showError(
            'Ups! Ocurrió un error',
            'No se pudieron cargar los datos correctamente'
          ),
      })
    );
  }

  getBestSellersByPage() {
    this.subscriptions.push(
      this.productsService
        .getBestSellingProductsByPageUser(
          this.pageIndexBestSellers,
          this.pageSizeBestSellers
        )
        .subscribe({
          next: (bestSellers) => {
            this.bestSellers = bestSellers;
          },
          error: () =>
            this.alertService.showError(
              'Ups! Ocurrió un error',
              'No se pudieron cargar los datos correctamente'
            ),
        })
    );
  }

  previousBestSellersPage() {
    if (this.pageIndexBestSellers > 0) {
      this.pageIndexBestSellers--;
      this.getBestSellersByPage();
    }
  }

  nextBestSellersPage() {
    if (
      this.pageIndexBestSellers <
      Math.ceil(this.lengthBestSellers / this.pageSizeBestSellers) - 1
    ) {
      this.pageIndexBestSellers++;
      this.getBestSellersByPage();
    }
  }

  onChangeRating(){
    this.requiredRating = false;
  }

  onSubmit() {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      if(this.commentForm.get('rating')?.invalid) this.requiredRating = true;
    } else {
      const user = this.authService.getAuthUser();
      if (user) {
        this.subscriptions.push(
          this.commentsService
            .addComment(
              {
                ...this.commentForm.value,
                user: user.user,
                product: this.productSelected,
              },
              this.pageIndex,
              this.pageSize
            )
            .subscribe({
              next: (data) => {
                this.comments = data;
                this.length++;
                this.commentFormDir.resetForm();
                this.updateProductData();
              },
              error: () =>
                this.alertService.showError(
                  'Ups! Ocurrió un error',
                  'No se pudo crear el comentario'
                ),
            })
        );
      } else {
        this.alertService
          .showWarningActionWaitResponse(
            'Necesita iniciar sesión',
            'Debe iniciar sesión para comentar',
            'Iniciar sesión'
          )
          .then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/shop/auth']);
            }
          });
      }
    }
  }

  getComments() {
    if (this.productSelected) {
      this.subscriptions.push(
        this.commentsService
          .getCommentsByProduct(this.productSelected.id)
          .subscribe({
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
        this.commentsService
          .getCommentsByPageByProduct(
            this.productSelected.id,
            this.pageIndex,
            this.pageSize
          )
          .subscribe({
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

  onChangeInputProductQuantity() {
    if (this.productSelected) {
      if (this.productSelected.stock < this.inputProductQuantity)
        this.inputProductQuantity = this.productSelected.stock;
      else if (this.inputProductQuantity <= 0) this.inputProductQuantity = 1;
    }
  }

  updateQuantityProduct(quantity: number) {
    if (this.productSelected) {
      if (
        this.productSelected.stock >= this.inputProductQuantity + quantity &&
        this.inputProductQuantity + quantity > 0
      ) {
        this.inputProductQuantity += quantity;
      }
    }
  }

  onAddProduct(product: Product | null) {
    if (product) {
      const orderDetail: OrderDetailRequest = {
        product,
        quantity: this.inputProductQuantity,
      };

      this.store.dispatch(ShoppingCartAction.addProduct({ orderDetail }));
      this.toastService.showToast("Se añadió el producto al carrito");
    }
  }

  redirectTo(path: string) {
    this.router.navigate([`/shop/${path}`]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }
}
