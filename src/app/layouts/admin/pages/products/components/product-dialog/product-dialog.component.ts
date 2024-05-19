import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../models/product';
import { ProductsService } from '../../products.service';
import { AlertService } from '../../../../../../core/alert.service';
import { LocalCraftsmenComponent } from '../../../local-craftsmen/local-craftsmen.component';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.scss'
})
export class ProductDialogComponent {
  hide = true;
  productForm: FormGroup;
  localCraftsman: any[] = [];
  viewMode: boolean;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<ProductDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: { product: Product, view: boolean, edit: boolean },
    private productsService: ProductsService, private alertService: AlertService) {
    this.viewMode = this.data.view;
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
    if (this.data.edit) {
      this.productForm.patchValue(this.data.product);
    }
    if (this.data.view) {
      this.productForm.patchValue(this.data.product);
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

  ngOnInit(): void {
    // this.getLocalCraftsmen();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      this.alertService.showError('Inválido','Esta acción es inválida')
      return;
    }
    this.matDialogRef.close(this.productForm.value);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
