import { Component } from '@angular/core';
import { Product } from '../../../admin/pages/products/models/product';
import { Subscription, map } from 'rxjs';
import { Router } from '@angular/router';
import { ProductsService } from '../../../admin/pages/products/products.service';
import { Category } from '../../../admin/pages/products/models/category';
import { Region } from '../../../admin/pages/regions/models/region';
import { RegionsService } from '../../../admin/pages/regions/regions.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ShoppingCartAction } from '../../../../core/store/shopping-cart/shopping-cart.actions';
import { OrderDetailRequest } from '../../models/order-detail-request';
import { MatDialog } from '@angular/material/dialog';
import { ShoppingCartComponent } from '../../components/shopping-cart/shopping-cart.component';

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

  productsByPage: Product[] = [];

  filterActive: boolean = false;
  filterForm: FormGroup;
  filterProducts: Product[] = [];

  categories: Category[] = [];
  regions: Region[] = [];
  products: Product[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private regionService: RegionsService,
    private fb: FormBuilder,
    private store: Store,
    public dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      price: this.fb.group({
        min: this.fb.control(10),
        max: this.fb.control(1500)
      }),
      order: this.fb.control(''),
      categories: this.fb.array([]),
      regions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.productsService.getProducts().subscribe({
        next: (products) => {
          this.length = products.length;
          this.products = products;
          if(!this.filterActive) this.filterProducts = this.products;
          this.showProductsByPage();
        },
      })
    );
    
    this.getCategories();
    this.getRegiones();
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

  getCategories(){
    this.subscriptions.push(
      this.productsService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories;
          this.categoriesArray.clear();
          categories.forEach(() => this.addCategoryControl());
        }
      })
    )
  }

  getRegiones(){
    this.subscriptions.push(
      this.regionService.getRegions().subscribe({
        next: (regions) => {
          this.regions = regions;
          this.regionsArray.clear();
          regions.forEach(() => this.addRegionControl());
        }
      })
    )
  }

  showProductsByPage(){
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
      this.inputPageNumber <= Math.ceil(this.length / 12.0)
    ) {
      this.pageIndex = this.inputPageNumber - 1;
      this.showProductsByPage();
    }
    
    this.inputPageNumber = this.pageIndex + 1;
  }

  nextPage() {
    if (this.pageIndex < Math.ceil(this.length / 12.0) - 1) {
      this.pageIndex++;
      this.showProductsByPage();
      this.inputPageNumber = this.pageIndex + 1;
    }
  }

  redirectTo(id: string): void {
    this.router.navigate([`/shop/catalog/${id}`]);
  }

  onFilterProducts(){
    this.filterActive = true;
    
    let temp = [];
    //Price filter
    let minPrice = this.filterForm.get('price')?.get('min')?.value;
    let maxPrice = this.filterForm.get('price')?.get('max')?.value;
    //OrderBy filter
    let selectedOrder = this.filterForm.get('order')?.value;
    //Category filter
    const selectedCategories = this.categories
    .map((category, i) => this.filterForm.get('categories')?.value[i] ? category.id : null)
    .filter(id => id !== null);
    //Region filter
    const selectedRegions = this.regions
    .map((region, i) => this.filterForm.get('regions')?.value[i] ? region.id : null)
    .filter(id => id !== null);
    
    temp = this.products.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    if(selectedCategories.length)
      temp = temp.filter(p => selectedCategories.includes(p.category.id));

    if(selectedRegions.length)
      temp = temp.filter(p => selectedRegions.includes(p.localCraftsman.region.id));
    
    switch(selectedOrder){
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
  
  cleanFilters(){
    this.filterActive = false;
    this.filterProducts = this.products;
    this.length = this.products.length;
    this.pageIndex = 0;
    this.inputPageNumber = this.pageIndex + 1;
    
    this.filterForm.reset({
      price: {
        min: 10,
        max: 1500
      }
    });
    this.showProductsByPage();
  }

  onAddProduct(product: Product){
    const orderDetail: OrderDetailRequest = {
      product,
      quantity: 1
    };
    
    this.store.dispatch(ShoppingCartAction.addProduct({product: orderDetail}));
    this.dialog.open(ShoppingCartComponent);
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }
}
