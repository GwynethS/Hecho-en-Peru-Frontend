import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalCraftsman } from '../../../local-craftsmen/models/localCraftsman';
import { Region } from '../../models/region';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
})
export class ProductDialogComponent implements OnInit {
  hide = true;
  productForm: FormGroup;
  categories: Category[] = [];
  regions: Region[] = [];
  localCraftsmen: LocalCraftsman[] = [];
  selectedFile: File | null = null;
  imageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<ProductDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private editingProduct?: Product
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      name_category: ['', Validators.required],
      name_region: ['', Validators.required],
      fullname_localCraftsman: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      averageRating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      history: ['', Validators.required],
      details: ['', Validators.required],
      image: ['', Validators.required],
      enabled: ['', Validators.required],
    });

    if (this.editingProduct) {
      this.productForm.patchValue({
        ...this.editingProduct,
        name_category: this.editingProduct.category.id,
        name_region: this.editingProduct.localCraftsman.region.id,
        fullname_localCraftsman: this.editingProduct.localCraftsman.id,
        enabled: this.editingProduct.enabled ? 'true' : 'false',
      });
      if (this.editingProduct && this.editingProduct.image) {
        const file = this.editingProduct.image;
        this.imageUrl = file.name;
      } else {
        this.imageUrl = null;
      }
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadRegions();
    this.loadLocalCraftsmen();
  }

  loadCategories(): void {
    this.http
      .get<Category[]>('http://localhost:8080/api/categories')
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (err) => {
          console.error('Failed to load categories', err);
        },
      });
  }

  loadRegions(): void {
    this.http.get<Region[]>('http://localhost:8080/api/regions').subscribe({
      next: (regions) => {
        this.regions = regions;
      },
      error: (err) => {
        console.error('Failed to load regions', err);
      },
    });
  }

  loadLocalCraftsmen(): void {
    this.http
      .get<LocalCraftsman[]>('http://localhost:8080/api/localCraftsmen')
      .subscribe({
        next: (localCraftsmen) => {
          this.localCraftsmen = localCraftsmen;
        },
        error: (err) => {
          console.error('Failed to load local craftsmen', err);
        },
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;
    const fileNameElement = document.getElementById('file-name');
    if (fileNameElement) {
      fileNameElement.textContent = file ? file.name : 'Ningún archivo seleccionado';
    }
  }

  onCreate(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
    } else {
      const productData = this.productForm.value;
      if (this.selectedFile) {
        this.uploadFile(this.selectedFile).then((imageUrl) => {
          productData.image = imageUrl;
          this.matDialogRef.close(productData);
        });
      } else {
        productData.image = this.editingProduct?.image;
        this.matDialogRef.close(productData);
      }
    }
  }

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const uploadUrl = 'http://localhost:8080/api/uploadsLoadImage';
    const headers = new HttpHeaders();
    return this.http
      .post<any>(uploadUrl, formData, { headers })
      .toPromise()
      .then((response) => {
        return response.imageUrl;
      });
  }

  onClearInputs(): void {
    this.productForm.reset();
    this.selectedFile = null;
    this.imageUrl = null;
  }
}
