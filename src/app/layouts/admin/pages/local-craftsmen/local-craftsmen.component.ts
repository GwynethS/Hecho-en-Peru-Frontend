import { Component, OnDestroy } from '@angular/core';
import { LocalCraftsman } from './models/local-craftsman';
import { Subscription } from 'rxjs';
import { LocalCraftsmenService } from './local-craftsmen.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../../core/alert.service';
import { LocalCraftsmanDialogComponent } from './components/local-craftsman-dialog/local-craftsman-dialog.component';

@Component({
  selector: 'app-local-craftsmen',
  templateUrl: './local-craftsmen.component.html',
  styleUrl: './local-craftsmen.component.scss',
})
export class LocalCraftsmenComponent implements OnDestroy {
  localCraftsmen: LocalCraftsman[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    private localCraftsmenService: LocalCraftsmenService,
    private matDialog: MatDialog,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.localCraftsmenService.getLocalCraftsmen().subscribe({
        next: (localCraftsmen) => {
          this.localCraftsmen = localCraftsmen;
          console.log(localCraftsmen);
        },
      })
    );
  }

  onCreateLocalCraftsman(): void {
    this.subscriptions.push(
      this.matDialog
        .open(LocalCraftsmanDialogComponent)
        .afterClosed()
        .subscribe({
          next: (localCraftsmanData) => {
            if (localCraftsmanData) {
              this.localCraftsmenService
                .addLocalCraftsmen(localCraftsmanData)
                .subscribe({
                  next: (localCraftsmen) => {
                    this.localCraftsmen = localCraftsmen;
                  },
                });
            }
          },
        })
    );
  }

  onEditLocalCraftsman(localCraftsman: LocalCraftsman) {
    this.subscriptions.push(
      this.matDialog
        .open(LocalCraftsmanDialogComponent, {
          data: { localCraftsman: localCraftsman, view: false, edit: true },
        })
        .afterClosed()
        .subscribe({
          next: (localCraftsmanData) => {
            if (localCraftsmanData) {
              this.localCraftsmenService
                .updateLocalCraftsmen(
                  localCraftsman.localCraftsmanId,
                  localCraftsmanData
                )
                .subscribe({
                  next: (localCraftsmen) => {
                    this.localCraftsmen = localCraftsmen;
                  },
                });
            }
          },
        })
    );
  }

  onViewLocalCraftsman(localCraftsman: LocalCraftsman) {
    this.matDialog.open(LocalCraftsmanDialogComponent, {
      data: { localCraftsman: localCraftsman, view: true, edit: false },
    });
  }

  onDeleteLocalCraftsman(id: LocalCraftsman) {
    this.alertService
      .showConfirmDeleteAction('este artesano')
      .then((result) => {
        if (result.isConfirmed) {
          this.localCraftsmenService
            .deleteLocalCraftsmenByID(id.localCraftsmanId)
            .subscribe({
              next: (localCraftsmen) => {
                this.localCraftsmen = localCraftsmen;
              },
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }
}
