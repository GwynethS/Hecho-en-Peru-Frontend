import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalCraftsman } from '../../../local-craftsmen/models/localCraftsman';
import { Region } from '../../models/region';
import { ProductsService } from '../../products.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
})
export class ProductDialogComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  regions: Region[] = [];
  localCraftsmen: LocalCraftsman[] = [];
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  imageName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) private editingProduct?: Product
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      name_category: ['', Validators.required],
      name_region: ['', Validators.required],
      fullname_localCraftsman: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      averageRating: ['',[Validators.required, Validators.min(0), Validators.max(5)]],
      history: ['', Validators.required],
      details: ['', Validators.required],
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
      if (this.editingProduct.image) {
        this.imageUrl = `http://localhost:8080/api/uploadsLoadImage/${this.editingProduct.image}`;
        this.imageName = this.extractFileName(this.editingProduct.image);
      }
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadRegions();
    this.loadLocalCraftsmen();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      },
    });
  }

  loadRegions(): void {
    this.productService.getRegions().subscribe({
      next: (regions) => {
        this.regions = regions;
      },
      error: (err) => {
        console.error('Failed to load regions', err);
      },
    });
  }

  loadLocalCraftsmen(): void {
    this.productService.getLocalCraftsmen().subscribe({
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
    this.updateImageUrl();
  }

  updateImageUrl(): void {
    if (this.selectedFile) {
      this.imageUrl = URL.createObjectURL(this.selectedFile);
      this.imageName = this.selectedFile.name;
    } else {
      this.imageUrl = null;
      this.imageName = null;
    }
  }

  extractFileName(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);
  }

  getFileName(): string {
    return this.imageName ? this.imageName : 'Ninguna imagen seleccionada';
  }

  onCreate(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
    } else {
      const productData = this.productForm.value;
      if (this.selectedFile) {
        this.uploadFile(this.selectedFile).then(({ imageUrl, filename }) => {
          productData.image = imageUrl;
          productData.imageName = filename;
          this.sendProductData(productData);
        });
      } else {
        this.sendProductData(productData);
      }
    }
  }

  async uploadFile(file: File): Promise<{ imageUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const uploadUrl = 'http://localhost:8080/api/uploadsLoadImage';
    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });
    const response = await firstValueFrom(this.httpClient.post<any>(uploadUrl, formData, { headers }));
    return { imageUrl: `http://localhost:8080/api/uploadsLoadImage/${response.filename}`, filename: response.filename };
  }

  sendProductData(productData: any): void {
    const formData = new FormData();
    formData.append('data', JSON.stringify(productData));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    if (this.editingProduct) {
      this.productService.updateProducts(this.editingProduct.id, formData).subscribe({
        next: () => {
          console.log('Product updated successfully');
        },
        error: (err) => {
          console.error('Failed to update product', err);
        },
      });
    } else {
      this.productService.addProducts(formData).subscribe({
        next: () => {
          console.log('Product created successfully');
        },
        error: (err) => {
          console.error('Failed to create product', err);
        },
      });
    }
  }

  onClearInputs(): void {
    this.productForm.reset();
    this.selectedFile = null;
    this.imageUrl = null;
    this.imageName = null;
  }
}
