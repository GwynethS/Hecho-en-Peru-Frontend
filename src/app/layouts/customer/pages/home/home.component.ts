import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  length = 5;
  pageSize = 3;
  pageIndex = 0;

  constructor(private router: Router) {}

  previousPage(){
    if(this.pageIndex > 0){
      this.pageIndex--;
      console.log(this.pageIndex);
    }
  }

  nextPage(){
    if(this.pageIndex < this.length - 1){
      this.pageIndex++;
      console.log(this.pageIndex);
    }
  }

  redirectTo(page: string): void {
    this.router.navigate([`/shop/${page}`]);
  }
}
