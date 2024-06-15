import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalCraftsman } from '../../models/local-craftsman';
import { Region } from '../../models/region';
import { environment } from '../../../../../../../environments/environment';
import { RegionsService } from '../../../regions/regions.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-local-craftsman-dialog',
  templateUrl: './local-craftsman-dialog.component.html',
  styleUrl: './local-craftsman-dialog.component.scss',
})
export class LocalCraftsmanDialogComponent implements OnInit {
  localCraftsmanForm: FormGroup;
  regions: Region[] = [];
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  imageName: string | null = null;
  requiredImage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private regionService: RegionsService,
    private matDialogRef: MatDialogRef<LocalCraftsmanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private editingLocalCraftsman?: LocalCraftsman
  ) {
    this.localCraftsmanForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', Validators.required],
      specialty: ['', Validators.required],
      experience: ['', [Validators.required, Validators.minLength(3)]],
      region_id: ['', Validators.required],
    });
    if (this.editingLocalCraftsman) {
      this.localCraftsmanForm.patchValue({
        ...this.editingLocalCraftsman,
        region_id: this.editingLocalCraftsman.region.id,
        enabled: this.editingLocalCraftsman.enabled ? 'true' : 'false',
      });
      if (this.editingLocalCraftsman.image) {
        this.imageUrl = `${environment.apiURL}uploadsLoadImage/${this.editingLocalCraftsman.image}`;
        this.imageName = this.extractFileName(this.editingLocalCraftsman.image);
      }
    }
  }

  ngOnInit(): void {
    this.loadRegions();
  }

  loadRegions(): void {
    this.regionService.getRegions().subscribe({
      next: (regions) => this.regions = regions,
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
    if (this.localCraftsmanForm.invalid) {
      this.localCraftsmanForm.markAllAsTouched();
      if(!this.selectedFile) this.requiredImage = true;
    } else {
      if (!this.editingLocalCraftsman && !this.selectedFile) {
        this.requiredImage = true;
        return; 
      }
      this.requiredImage = false;
      
      forkJoin({
        region: this.regionService.getSearchRegionDetailsByID(
          this.localCraftsmanForm.get('region_id')?.value
        ),
      }).subscribe({
        next: (results) => {
          const region = results.region;
          const localCraftsmanData = { ...this.localCraftsmanForm.value, region };
          let imageToSend;
          
          if (this.selectedFile) {
            imageToSend = this.selectedFile;
          } else {
            imageToSend = this.localCraftsmanForm.get('image')?.value || new Blob();
          }
          this.matDialogRef.close({ localCraftsmanData, image: imageToSend });
        },
      });
    }
  }

  onCancel(): void {
    this.matDialogRef.close();
    this.selectedFile = null;
    this.imageUrl = null;
    this.imageName = null;
  }
}
