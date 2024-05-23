import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss'
})
export class CategoryDialogComponent {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[] }
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onConfirm(): void {
    if (this.categoryForm.valid) {
      const newCategory: Category = {
        id: this.categoryForm.value.categoryId,
        name: this.categoryForm.value.name
      };
      this.matDialogRef.close(newCategory);
    }
  }

  onCancel(): void {
    this.matDialogRef.close();
  }
}
