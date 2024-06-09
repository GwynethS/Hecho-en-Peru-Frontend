import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ProductsService } from '../../../products/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../../../../core/store/auth/auth.selectors';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetail } from './models/order-detail';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent {
  orderSearchForm: FormGroup;
  orders: OrderDetail[] = [];

  subscriptions: Subscription[] = [];

  

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private store: Store,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.orderSearchForm = this.fb.group({
      id: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    });
  }

  ngOnInit(): void {
  }

  
}
