import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalCraftsman } from '../../models/local-craftsman';
import { LocalCraftsmenService } from '../../local-craftsmen.service';
import { Region } from '../../models/region';

@Component({
  selector: 'app-local-craftsman-dialog',
  templateUrl: './local-craftsman-dialog.component.html',
  styleUrl: './local-craftsman-dialog.component.scss',
})
export class LocalCraftsmanDialogComponent {
  regions: Region[] = [];
  localCraftsmanForm: FormGroup;
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<LocalCraftsmanDialogComponent>,
    private localCraftsmenService: LocalCraftsmenService, // Inyectamos el servicio
    @Inject(MAT_DIALOG_DATA) private editinglocalCraftsman?: LocalCraftsman
  ) {
    this.localCraftsmanForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      specialty: ['', Validators.required],
      image: [null, Validators.required],
      experience: ['', [Validators.required, Validators.minLength(3)]],
      name_region: ['', [Validators.required, Validators.minLength(3)]],
      enabled: ['', Validators.required],
    });

    if (this.editinglocalCraftsman) {
      this.localCraftsmanForm.patchValue(this.editinglocalCraftsman);
      this.localCraftsmanForm.get('image')?.clearValidators();
      this.localCraftsmanForm.updateValueAndValidity();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;
  
    // Convertir la imagen a Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageUrl = e.target?.result || null;
    };
    reader.readAsDataURL(file);
  }  

  onCreate(): void {
    if (this.localCraftsmanForm.invalid || !this.selectedFile) {
      this.localCraftsmanForm.markAllAsTouched();
      return;
    }
  }

  onClearInputs(): void {
    this.localCraftsmanForm.reset();
    this.selectedFile = null;
    this.imageUrl = null;
  }
}
