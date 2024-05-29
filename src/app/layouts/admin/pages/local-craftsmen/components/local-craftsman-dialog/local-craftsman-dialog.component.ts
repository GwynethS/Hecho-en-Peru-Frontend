import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalCraftsman } from '../../models/localCraftsman';

@Component({
  selector: 'app-local-craftsman-dialog',
  templateUrl: './local-craftsman-dialog.component.html',
  styleUrl: './local-craftsman-dialog.component.scss',
})
export class LocalCraftsmanDialogComponent {
  hide = true;
  localCraftsmanForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<LocalCraftsmanDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private editinglocalCraftsman?: LocalCraftsman
  ) {
    this.localCraftsmanForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      specialty: ['', Validators.required],
      image: [Validators.required],
      experience: ['', [Validators.required, Validators.minLength(3)]],
      name_region: ['', [Validators.required, Validators.minLength(3)]],
      enabled: ['', Validators.required],
    });
    if (this.editinglocalCraftsman) {
      this.localCraftsmanForm.patchValue(this.editinglocalCraftsman);
    }
    if (this.editinglocalCraftsman) {
      this.localCraftsmanForm.patchValue(this.editinglocalCraftsman);
      this.localCraftsmanForm.get('fullName')?.disable();
      this.localCraftsmanForm.get('description')?.disable();
      this.localCraftsmanForm.get('specialty')?.disable();
      this.localCraftsmanForm.get('image')?.disable();
      this.localCraftsmanForm.get('experience')?.disable();
      this.localCraftsmanForm.get('name_region')?.disable();
      this.localCraftsmanForm.get('enabled')?.disable();
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
    if (this.localCraftsmanForm.invalid) {
      this.localCraftsmanForm.markAllAsTouched();
    } else {
      const productData = this.localCraftsmanForm.value;
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
    this.localCraftsmanForm.reset();
    this.selectedFile = null;
  }
}
