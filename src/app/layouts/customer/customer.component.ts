import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  isLoading = false;

  loadingSubscription?: Subscription;

  constructor(private loadingService: LoadingService) {
    this.loadingSubscription = this.loadingService.isLoading$.subscribe({
      next: (value) => {
        setTimeout(() => this.isLoading = value);
      }
    })
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }
}
