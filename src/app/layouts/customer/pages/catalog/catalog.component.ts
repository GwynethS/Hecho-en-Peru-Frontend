import { Component } from '@angular/core';
import { Product } from '../../../admin/pages/products/models/product';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ProductsService } from '../../../admin/pages/products/products.service';
import { Category } from '../../../admin/pages/products/models/category';
import { Region } from '../../../admin/pages/regions/models/region';
import { RegionsService } from '../../../admin/pages/regions/regions.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ShoppingCartAction } from '../../../../core/store/shopping-cart/shopping-cart.actions';
import { OrderDetailRequest } from '../checkout/models/order-detail-request';
import { ToastService } from '../../../../core/services/toast.service';
import { environment } from '../../../../../environments/environment';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  apiURL = environment.apiURL;

  length = 0;
  pageSize = 12;
  pageIndex = 0;

  lengthBestSellers = 0;
  pageSizeBestSellers = 4;
  pageIndexBestSellers = 0;

  inputPageNumber = 1;

  productsByPage: Product[] = [];

  filterActive: boolean = false;
  filterForm: FormGroup;
  filterProducts: Product[] = [];

  categories: Category[] = [];
  regions: Region[] = [];
  products: Product[] = [];
  bestSellers: Product[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private regionService: RegionsService,
    private alertService: AlertService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private store: Store
  ) {
    this.filterForm = this.fb.group({
      price: this.fb.group({
        min: this.fb.control(10),
        max: this.fb.control(1500),
      }),
      order: this.fb.control(''),
      categories: this.fb.array([]),
      regions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.productsService.getProducts().subscribe({
        next: (products) => {
          this.length = products.length;
          this.products = products;
          if (!this.filterActive) this.filterProducts = this.products;
          this.showProductsByPage();
        },
        error: () =>
          this.alertService.showError(
            'Ups! Ocurrió un error',
            'No se pudieron cargar los datos correctamente'
          ),
      })
    );

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

    this.getBestSellersByPage();
    this.getCategories();
    this.getRegiones();
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

  get categoriesArray() {
    return this.filterForm.get('categories') as FormArray;
  }

  get regionsArray() {
    return this.filterForm.get('regions') as FormArray;
  }

  private addCategoryControl(): void {
    this.categoriesArray.push(new FormControl(false));
  }

  private addRegionControl(): void {
    this.regionsArray.push(new FormControl(false));
  }

  getCategories() {
    this.subscriptions.push(
      this.productsService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories;
          this.categoriesArray.clear();
          categories.forEach(() => this.addCategoryControl());
        },
        error: () =>
          this.alertService.showError(
            'Ups! Ocurrió un error',
            'No se pudieron cargar los datos correctamente'
          ),
      })
    );
  }

  getRegiones() {
    this.subscriptions.push(
      this.regionService.getRegions().subscribe({
        next: (regions) => {
          this.regions = regions;
          this.regionsArray.clear();
          regions.forEach(() => this.addRegionControl());
        },
        error: () =>
          this.alertService.showError(
            'Ups! Ocurrió un error',
            'No se pudieron cargar los datos correctamente'
          ),
      })
    );
  }

  showProductsByPage() {
    const starIndex = this.pageIndex * this.pageSize;
    const endIndex = starIndex + this.pageSize;
    this.productsByPage = this.filterProducts.slice(starIndex, endIndex);
  }

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.showProductsByPage();
      this.inputPageNumber = this.pageIndex + 1;
    }
  }

  changeInputPage() {
    if (
      this.inputPageNumber > 0 &&
      this.inputPageNumber <= Math.ceil(this.length / this.pageSize)
    ) {
      this.pageIndex = this.inputPageNumber - 1;
      this.showProductsByPage();
    }

    this.inputPageNumber = this.pageIndex + 1;
  }

  nextPage() {
    if (this.pageIndex < Math.ceil(this.length / this.pageSize) - 1) {
      this.pageIndex++;
      this.showProductsByPage();
      this.inputPageNumber = this.pageIndex + 1;
    }
  }

  redirectTo(id: string): void {
    this.router.navigate([`/shop/catalog/${id}`]);
  }

  onFilterProducts() {
    this.filterActive = true;

    let temp = [];
    //Price filter
    let minPrice = this.filterForm.get('price')?.get('min')?.value;
    let maxPrice = this.filterForm.get('price')?.get('max')?.value;
    //OrderBy filter
    let selectedOrder = this.filterForm.get('order')?.value;
    //Category filter
    const selectedCategories = this.categories
      .map((category, i) =>
        this.filterForm.get('categories')?.value[i] ? category.id : null
      )
      .filter((id) => id !== null);
    //Region filter
    const selectedRegions = this.regions
      .map((region, i) =>
        this.filterForm.get('regions')?.value[i] ? region.id : null
      )
      .filter((id) => id !== null);

    temp = this.products.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );

    if (selectedCategories.length)
      temp = temp.filter((p) => selectedCategories.includes(p.category.id));

    if (selectedRegions.length)
      temp = temp.filter((p) =>
        selectedRegions.includes(p.localCraftsman.region.id)
      );

    switch (selectedOrder) {
      case 'PDSC': {
        temp.sort((a, b) => b.price - a.price);
        break;
      }
      case 'PASC': {
        temp.sort((a, b) => a.price - b.price);
        break;
      }
      case 'RDSC': {
        temp.sort((a, b) => b.averageRating - a.averageRating);
        break;
      }
    }

    this.filterProducts = temp;
    this.length = this.filterProducts.length;

    this.showProductsByPage();
  }

  cleanFilters() {
    this.filterActive = false;
    this.filterProducts = this.products;
    this.length = this.products.length;
    this.pageIndex = 0;
    this.inputPageNumber = this.pageIndex + 1;

    this.filterForm.reset({
      price: {
        min: 10,
        max: 1500,
      },
    });
    this.showProductsByPage();
  }

  onAddProduct(product: Product) {
    const orderDetail: OrderDetailRequest = {
      product,
      quantity: 1,
    };

    this.store.dispatch(ShoppingCartAction.addProduct({ orderDetail }));
    this.toastService.showToast('Se añadió el producto al carrito');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }
}
