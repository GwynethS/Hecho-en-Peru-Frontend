import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Region } from '../../models/region';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-region-dialog',
  templateUrl: './region-dialog.component.html',
  styleUrl: './region-dialog.component.scss',
})
export class RegionDialogComponent {
  hide = true;
  regionForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<RegionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private editingRegion?: Region
  ) {
    this.regionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      image: [Validators.required],
      history: ['', [Validators.required, Validators.minLength(3)]],
      sitesIntroduction: ['', [Validators.required, Validators.minLength(3)]],
      craftsmenIntroduction: ['', [Validators.required, Validators.minLength(3)]],
    });
    if (this.editingRegion) {
      this.regionForm.patchValue(this.editingRegion);
    }
    if (this.editingRegion) {
      this.regionForm.patchValue(this.editingRegion);
      this.regionForm.get('name')?.disable();
      this.regionForm.get('image')?.disable();
      this.regionForm.get('history')?.disable();
      this.regionForm.get('sitesIntroduction')?.disable();
      this.regionForm.get('craftsmenIntroduction')?.disable();
    }
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
    if (this.regionForm.invalid) {
      this.regionForm.markAllAsTouched();
    } else {
      const productData = this.regionForm.value;
      if (this.selectedFile) {
        this.uploadFile(this.selectedFile).then((imageUrl) => {
          productData.image = imageUrl;
          this.matDialogRef.close(productData);
        });
      } else {
        this.matDialogRef.close(productData);
      }
    }
  }

  async uploadFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`http://localhost:8080/api/uploadsLoadImage/{{$product.image}}`);
      }, 2000);
    });
  }

  onClearInputs(): void {
    this.regionForm.reset();
    this.selectedFile = null;
  }
}
