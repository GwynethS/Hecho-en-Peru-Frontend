import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss'
})
export class ProductDialogComponent {
  hide = true;
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
      private editingProduct? : Product
    ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category_name: ['', [Validators.required, Validators.minLength(3)]],
      region_name: ['', Validators.required],
      localCraftsman_fullname: ['', [Validators.required, Validators.email]],
      price: ['', [Validators.required, Validators.minLength(3)]],
      stock: ['', Validators.required],
      average_rating: ['', Validators.required],
      history: ['', Validators.required],
      details: ['', Validators.required],
      image: [Validators.required],
      enable: ['', Validators.required],
    });
    if (this.editingProduct) {
      this.productForm.patchValue(this.editingProduct);
    }
    if (this.editingProduct) {
      this.productForm.patchValue(this.editingProduct);
      this.productForm.get('name')?.disable();
      this.productForm.get('category_name')?.disable();
      this.productForm.get('region_name')?.disable();
      this.productForm.get('localCraftsman_fullname')?.disable();
      this.productForm.get('price')?.disable();
      this.productForm.get('stock')?.disable();
      this.productForm.get('average_rating')?.disable();
      this.productForm.get('history')?.disable();
      this.productForm.get('details')?.disable();
      this.productForm.get('image')?.disable();
      this.productForm.get('enable')?.disable();
    }
  }

  onCreate(): void {
    if(this.productForm.invalid){
      this.productForm.markAllAsTouched();
    }else{
      this.matDialogRef.close(this.productForm.value);
    }
  }

  onClearInputs(): void {
    this.productForm.reset();
  }
}
