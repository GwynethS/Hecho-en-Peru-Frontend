import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  constructor(private router: Router) {}

  redirectTo(page: string): void {
    this.router.navigate([`/shop/${page}`]);
  }
}
