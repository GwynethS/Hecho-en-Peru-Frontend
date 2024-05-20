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
      siteIntroduction: ['', [Validators.required, Validators.minLength(3)]],
      craftsmenIntroduction: [
        '',
        [Validators.required, Validators.minLength(3)],
      ],
    });
    if (this.editingRegion) {
      this.regionForm.patchValue(this.editingRegion);
    }
    if (this.editingRegion) {
      this.regionForm.patchValue(this.editingRegion);
      this.regionForm.get('name')?.disable();
      this.regionForm.get('image')?.disable();
      this.regionForm.get('history')?.disable();
      this.regionForm.get('siteIntroduction')?.disable();
      this.regionForm.get('craftsmenIntroduction')?.disable();
    }
  }

  onCreate(): void {
    if (this.regionForm.invalid) {
      this.regionForm.markAllAsTouched();
    } else {
      this.matDialogRef.close(this.regionForm.value);
    }
  }

  onClearInputs(): void {
    this.regionForm.reset();
  }
}
