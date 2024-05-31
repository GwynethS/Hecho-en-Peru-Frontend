import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalCraftsman } from '../../../local-craftsmen/models/localCraftsman';
import { Region } from '../../models/region';
import { ProductsService } from '../../products.service';

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
    private productService: ProductsService,
    private http: HttpClient,
    private matDialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private editingProduct?: Product
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      name_category: ['', Validators.required],
      name_region: ['', Validators.required],
      fullname_localCraftsman: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      averageRating: [
        '',
        [Validators.required, Validators.min(0), Validators.max(5)],
      ],
      history: ['', Validators.required],
      details: ['', Validators.required],
      enabled: ['', Validators.required],
      image: [''], // Agrega un campo para la imagen
    });

    if (this.editingProduct) {
      this.productForm.patchValue({
        name: this.editingProduct.name,
      });
      if (this.editingProduct) {
        this.productForm.patchValue({
          ...this.editingProduct,
          name_category: this.editingProduct.category.id,
          name_region: this.editingProduct.localCraftsman.region.id,
          fullname_localCraftsman: this.editingProduct.localCraftsman.id,
          enabled: this.editingProduct.enabled ? 'true' : 'false',
        });
      }
      if (this.editingProduct.image) {
        this.imageUrl = this.editingProduct.image;
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
    } else {
      this.imageUrl = null;
    }
  }
  
  getFileName(): string {
    if (this.selectedFile) {
      return this.selectedFile.name;
    } else {
      return "Ninguna imagen seleccionada";
    }
  }
  
  onCreate(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
    } else {
      const productData = this.productForm.value;
      if (this.selectedFile) {
        // Si se selecciona un archivo, carga la imagen al servidor y luego crea/actualiza el producto
        this.uploadFile(this.selectedFile).then(({ imageUrl, filename }) => {
          productData.image = imageUrl;
          productData.imageName = filename; // Agrega el nombre del archivo al objeto de datos del producto
          this.sendProductData(productData);
        });
      } else {
        // Si no se selecciona ningún archivo, crea/actualiza el producto sin la imagen
        this.sendProductData(productData);
      }
    }
  }

  async uploadFile(
    file: File
  ): Promise<{ imageUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name); // Adjunta el archivo con su nombre
    const uploadUrl = 'http://localhost:8080/api/uploadsLoadImage';
    const headers = new HttpHeaders();
    return this.http
      .post<any>(uploadUrl, formData, { headers })
      .toPromise()
      .then((response) => {
        return { imageUrl: response.imageUrl, filename: response.filename }; // Retorna tanto la URL como el nombre del archivo
      });
  }

  sendProductData(productData: any): void {
    if (this.editingProduct) {
    } else {
      // Lógica para crear un nuevo producto
    }
  }

  onClearInputs(): void {
    this.productForm.reset();
    this.selectedFile = null;
    this.imageUrl = null;
  }
}
