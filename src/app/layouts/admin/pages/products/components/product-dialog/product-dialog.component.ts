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
  requiredImage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private localCraftsmanService: LocalCraftsmenService,
    private matDialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private editingProduct?: Product
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category_id: ['', Validators.required],
      localCraftsman_id: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(1)]],
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
      next: (categories) => (this.categories = categories),
    });
  }

  loadLocalCraftsmen(): void {
    this.localCraftsmanService.getAllLocalCraftsmen().subscribe({
      next: (localCraftsmen) => (this.localCraftsmen = localCraftsmen),
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
      this.requiredImage = false;
    } else {
      this.requiredImage = true;
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
      if (!this.selectedFile) this.requiredImage = true;
    } else {
      if (!this.editingProduct && !this.selectedFile) {
        this.requiredImage = true;
        return;
      }
      this.requiredImage = false;

      forkJoin({
        localCraftsman:
          this.localCraftsmanService.getSearchLocalCraftsmanDetailsByID(
            this.productForm.get('localCraftsman_id')?.value
          ),
        category: this.productService.getCategoriesByID(
          this.productForm.get('category_id')?.value
        ),
      }).subscribe({
        next: (results) => {
          const localCraftsman = results.localCraftsman;
          const category = results.category;
          const productData = {
            ...this.productForm.value,
            localCraftsman,
            category,
          };
          let imageToSend;

          if (this.selectedFile) {
            imageToSend = this.selectedFile;
          } else {
            imageToSend = this.productForm.get('image')?.value || new Blob();
          }
          this.matDialogRef.close({ productData, image: imageToSend });
        },
      });
    }
  }

  onCancel(): void {
    this.matDialogRef.close();
    this.selectedFile = null;
    this.imageUrl = null;
    this.imageName = null;
  }
}
