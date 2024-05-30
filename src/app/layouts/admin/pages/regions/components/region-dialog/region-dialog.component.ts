import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Region } from '../../models/region';

@Component({
  selector: 'app-region-dialog',
  templateUrl: './region-dialog.component.html',
  styleUrls: ['./region-dialog.component.scss'],
})
export class RegionDialogComponent {
  regionForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<RegionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private editingRegion?: Region
  ) {
    this.regionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      image: [null, Validators.required],
      history: ['', [Validators.required, Validators.minLength(3)]],
      sitesIntroduction: ['', [Validators.required, Validators.minLength(3)]],
      craftsmenIntroduction: ['', [Validators.required, Validators.minLength(3)]],
    });

    if (this.editingRegion) {
      this.regionForm.patchValue(this.editingRegion);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;
    const fileNameElement = document.getElementById('file-name');
    if (fileNameElement) {
      fileNameElement.textContent = file ? file.name : 'Ninguna imagen seleccionada';
    }
  }

  onCreate(): void {
    if (this.regionForm.invalid) {
      this.regionForm.markAllAsTouched();
    } else {
      const regionData = { ...this.regionForm.value, image: this.selectedFile };
      this.matDialogRef.close(regionData);
    }
  }

  onClearInputs(): void {
    this.regionForm.reset();
    this.selectedFile = null;
    const fileNameElement = document.getElementById('file-name');
    if (fileNameElement) {
      fileNameElement.textContent = 'Ninguna imagen seleccionada';
    }
  }
}
