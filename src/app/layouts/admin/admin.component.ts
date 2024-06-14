import { Component } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  showSidebar = true;

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
