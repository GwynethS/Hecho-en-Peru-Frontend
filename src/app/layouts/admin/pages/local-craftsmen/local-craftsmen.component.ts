import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocalCraftsman } from './models/local-craftsman';
import { Subscription } from 'rxjs';
import { LocalCraftsmenService } from './local-craftsmen.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../../core/services/alert.service';
import { LocalCraftsmanDialogComponent } from './components/local-craftsman-dialog/local-craftsman-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-local-craftsmen',
  templateUrl: './local-craftsmen.component.html',
  styleUrl: './local-craftsmen.component.scss',
})
export class LocalCraftsmenComponent implements OnInit, OnDestroy {
  pageSize = 50;
  pageIndex = 0;

  localCraftsmanSearchForm: FormGroup;
  localCraftsmen: LocalCraftsman[] = [];
  dataSource = new MatTableDataSource<LocalCraftsman>();

  searchAttempted = false;

  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private localCraftsmenService: LocalCraftsmenService,
    private matDialog: MatDialog,
    private alertService: AlertService,
    private toastService: ToastService,
  ) {
    this.localCraftsmanSearchForm = this.fb.group({
      id: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')])
    });
  }

  ngOnInit(): void {
    this.loadLocalCraftsmenPage();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }

  loadLocalCraftsmenPage(): void {
    const offset = this.pageIndex * this.pageSize;
    const subscription = this.localCraftsmenService
      .getLocalCraftsmenByPageAdmin(offset, this.pageSize).subscribe({
        next: (localCraftsmen) => {
          this.localCraftsmen = localCraftsmen || [];
          this.dataSource.data = this.localCraftsmen;
        },
        error: (err) => {
          this.localCraftsmen = [];
          this.dataSource.data = this.localCraftsmen;
          console.error('Failed to load local craftsman', err);
        }
      });
    this.subscriptions.push(subscription);
  }

  onSearch(): void {
    if (this.localCraftsmanSearchForm.invalid) {
      this.localCraftsmanSearchForm.markAllAsTouched();
    } else {
      const subscription = this.localCraftsmenService
        .getSearchLocalCraftsmanDetailsByID(this.localCraftsmanSearchForm.value.id)
        .subscribe({
          next: (localCraftsman) => {
            this.localCraftsmen = [localCraftsman];
            this.dataSource.data = this.localCraftsmen;
          },
          error: (err) => {
            console.error(`Failed to load local craftsman with ID ${this.localCraftsmanSearchForm.value.id}`, err);
            this.searchAttempted = true;
            this.dataSource.data = [];
          }
        });
      this.subscriptions.push(subscription);
    }
  }

  onClean(): void {
    this.localCraftsmanSearchForm.reset();
    this.pageIndex = 0;
    this.loadLocalCraftsmenPage();
    this.searchAttempted = false;
  }

  onCreateLocalCraftsman(): void {
    this.matDialog
      .open(LocalCraftsmanDialogComponent)
      .afterClosed()
      .subscribe(
        (result) => {
        if (result) {
          const { localCraftsmanData, image } = result;
          this.localCraftsmenService.addLocalCraftsmen(localCraftsmanData, image)
            .subscribe({
              next: () => {
                this.loadLocalCraftsmenPage(),
                this.toastService.showToast("Se añadió el artesano correctamente");
              },
              error: (err) => console.error('Error adding local craftsman', err)
            });
        }}
      );
  }

  onEditLocalCraftsman(localCraftsman: LocalCraftsman): void {
    this.matDialog
      .open(LocalCraftsmanDialogComponent, { data: localCraftsman })
      .afterClosed()
      .subscribe({
        next: (result) => {
          if (result) {
            const { localCraftsmanData, image } = result;
            this.localCraftsmenService.updateLocalCraftsmen(localCraftsman.id, localCraftsmanData, image)
              .subscribe({
                next: () => {
                  this.loadLocalCraftsmenPage(),
                  this.toastService.showToast("Se actualizó el artesano correctamente");
                },
                error: (err) => console.error('Error updating local craftsman', err)
              });
          }
        },
        error: (err) => console.error('Failed to open local craftsman dialog', err),
      });
  }

  onViewLocalCraftsman(localCraftsman: LocalCraftsman): void {
    this.matDialog.open(LocalCraftsmanDialogComponent, {
      data: { localCraftsman: localCraftsman, view: true, edit: false },
    });
  }

  onDeleteLocalCraftsman(id: string): void {
    this.alertService.showConfirmDeleteAction('este artesano')
      .then(result => {
        if (result.isConfirmed) {
          const deleteSubscription = this.localCraftsmenService.deleteLocalCraftsmenByID(id)
            .subscribe({
              next: () => {
                this.loadLocalCraftsmenPage(),
                this.toastService.showToast("Se eliminó el artesano correctamente");
              },
              error: (err) => console.error('Failed to delete local craftsman', err)
            });
          this.subscriptions.push(deleteSubscription);
        }
      });
  }
}
