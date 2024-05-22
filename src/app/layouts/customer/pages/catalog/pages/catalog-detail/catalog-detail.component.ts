import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.component.html',
  styleUrl: './catalog-detail.component.scss',
})
export class CatalogDetailComponent {
  length = 50;
  pageSize = 12;
  pageIndex = 0;

  pageEvent!: PageEvent;

  commentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      textCommentary: this.fb.control('', Validators.required),
      rating: this.fb.control('', Validators.required),
    });
  }

  onSubmit(){
    if(this.commentForm.invalid){
      this.commentForm.markAllAsTouched();
    }else{
      console.log(this.commentForm.value);
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
}
