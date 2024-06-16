import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Region } from '../../models/region';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-region-dialog',
  templateUrl: './region-dialog.component.html',
  styleUrl: './region-dialog.component.scss',
})
export class RegionDialogComponent {
  regionForm: FormGroup;
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  imageName: string | null = null;
  requiredImage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<RegionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private editingRegion?: Region
  ) {
    this.regionForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$'),
        ],
      ],
      history: ['', [Validators.required, Validators.minLength(3)]],
      sitesIntroduction: ['', [Validators.required, Validators.minLength(3)]],
      craftsmenIntroduction: [
        '',
        [Validators.required, Validators.minLength(3)],
      ],
    });
    if (this.editingRegion) {
      this.regionForm.patchValue(this.editingRegion);
      if (this.editingRegion.image) {
        this.imageUrl = `${environment.apiURL}uploadsLoadImage/${this.editingRegion.image}`;
        this.imageName = this.extractFileName(this.editingRegion.image);
      }
    }
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
    if (this.regionForm.invalid) {
      this.regionForm.markAllAsTouched();
      if (!this.selectedFile) this.requiredImage = true;
    } else {
      if (!this.editingRegion && !this.selectedFile) {
        this.requiredImage = true;
        return;
      }

      this.requiredImage = false;

      const regionData = { ...this.regionForm.value };

      if (!this.selectedFile && this.editingRegion) {
        regionData.image = this.editingRegion.image;
      }

      let imageToSend;
      if (this.selectedFile) {
        imageToSend = this.selectedFile;
      } else {
        imageToSend = this.regionForm.get('image')?.value || new Blob();
      }
      this.matDialogRef.close({ regionData, image: imageToSend });
    }
  }

  onCancel(): void {
    this.matDialogRef.close();
    this.selectedFile = null;
    this.imageUrl = null;
    this.imageName = null;
  }
}
