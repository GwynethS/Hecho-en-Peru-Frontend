import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { LocalCraftsman } from '../../../local-craftsmen/models/local-craftsman';
import { Region } from '../../models/region';
import { ProductsService } from '../../products.service';
import { forkJoin } from 'rxjs';
import { LocalCraftsmenService } from '../../../local-craftsmen/local-craftsmen.service';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss',
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
    private localCraftsmenService: LocalCraftsmenService,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private editingProduct?: Product
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category_id: ['', Validators.required],
      localCraftsman_id: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(1)]],
      stock: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.min(1)]],
      history: ['', Validators.required],
      details: ['', Validators.required],
    });
    if (this.editingProduct) {
      this.productForm.patchValue({
        ...this.editingProduct,
        category_id: this.editingProduct.category.id,
        localCraftsman_id: this.editingProduct.localCraftsman.id,
        enabled: this.editingProduct.enabled ? 'true' : 'false',
      });
      if (this.editingProduct.image) {
        this.imageUrl = `${environment.apiURL}uploadsLoadImage/${this.editingProduct.image}`;
        this.imageName = this.extractFileName(this.editingProduct.image);
      }
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadLocalCraftsmen();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadLocalCraftsmen(): void {
    this.localCraftsmenService.getLocalCraftsmen().subscribe({
      next: (localCraftsmen) => this.localCraftsmen = localCraftsmen,
      error: (err) => console.error('Failed to load local craftsmen', err)
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

  onSave(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
    } else {
      forkJoin({
        localCraftsman: this.localCraftsmenService.getSearchLocalCraftsmanDetailsByID(
            this.productForm.get('localCraftsman_id')?.value
          ),
        category: this.productService.getCategoriesByID(
          this.productForm.get('category_id')?.value
        ),
      }).subscribe({
        next: (results) => {
          const localCraftsman = results.localCraftsman;
          const category = results.category;
          const productData = { ...this.productForm.value, localCraftsman, category };
          
          let imageToSend;
          if (this.selectedFile) {
            imageToSend = this.selectedFile;
          } else {
            imageToSend = this.productForm.get('image')?.value || new Blob();
          }
          this.dialogRef.close({ productData, image: imageToSend });
        },
        error: (err) => {
          console.error('Error in one of the requests', err);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
    this.selectedFile = null;
    this.imageUrl = null;
    this.imageName = null;
  }
}
