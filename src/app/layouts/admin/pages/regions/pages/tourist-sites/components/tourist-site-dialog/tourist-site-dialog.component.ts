import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TouristSite } from '../../models/tourist-site';
import { environment } from '../../../../../../../../../environments/environment';
import { RegionsService } from '../../../../regions.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tourist-site-dialog',
  templateUrl: './tourist-site-dialog.component.html',
  styleUrl: './tourist-site-dialog.component.scss',
})
export class TouristSiteDialogComponent {
  touristSiteForm: FormGroup;
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  imageName: string | null = null;
  region: any;
  requiredImage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private regionService: RegionsService,
    private matDialogRef: MatDialogRef<TouristSiteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private editingTouristSite?: TouristSite
  ) {
    this.touristSiteForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
    });
    if (this.editingTouristSite) {
      this.touristSiteForm.patchValue({ ...this.editingTouristSite });
      if (this.editingTouristSite.image) {
        this.imageUrl = `${environment.apiURL}uploadsLoadImage/${this.editingTouristSite.image}`;
        this.imageName = this.extractFileName(this.editingTouristSite.image);
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
    if (this.touristSiteForm.invalid) {
      this.touristSiteForm.markAllAsTouched();
      if(!this.selectedFile) this.requiredImage = true;
    } else {
      if (!this.editingTouristSite && !this.selectedFile) { 
        this.requiredImage = true;
        return;
      }
      
      this.requiredImage = false;
      
      forkJoin({
        region: this.regionService.getSearchRegionDetailsByID(this.touristSiteForm.get('region_id')?.value),
      }).subscribe({
        next: (results) => {
          const region = results.region;
          const touristSiteData = { ...this.touristSiteForm.value, region };
          
          if (!this.selectedFile && this.editingTouristSite) {
            touristSiteData.image = this.editingTouristSite.image;
          }
          
          let imageToSend;
          if (this.selectedFile) {
            imageToSend = this.selectedFile;
          } else {
            imageToSend = this.touristSiteForm.get('image')?.value || new Blob();
          }
          this.matDialogRef.close({ touristSiteData, image: imageToSend });
        },
        error: (err) => {
          console.error('Error in one of the requests', err);
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
