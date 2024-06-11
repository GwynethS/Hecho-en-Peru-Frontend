import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalCraftsman } from '../../models/local-craftsman';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalCraftsmenService } from '../../local-craftsmen.service';

@Component({
  selector: 'app-local-craftsman-details',
  templateUrl: './local-craftsman-details.component.html',
  styleUrl: './local-craftsman-details.component.scss'
})
export class LocalCraftsmanDetailsComponent implements OnInit, OnDestroy {
  localCraftsmanSelected: LocalCraftsman | null = null;
  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private localCraftsmenService: LocalCraftsmenService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const productId = this.activatedRoute.snapshot.paramMap.get('id');
    if (productId) {
      this.subscriptions.push(
        this.localCraftsmenService.getSearchLocalCraftsmanDetailsByID(productId).subscribe({
          next: (findedlocalCraftsman) => {
            if (findedlocalCraftsman) {
              this.localCraftsmanSelected = findedlocalCraftsman;
            }
          },
          error: () => {
            this.router.navigate(['/404']);
          },
        })
      );
    } else {
      this.router.navigate(['/404']);
    }
  }

  redirectToLocalCraftsmen() {
    this.router.navigate([`/admin/local-craftsmen`]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
