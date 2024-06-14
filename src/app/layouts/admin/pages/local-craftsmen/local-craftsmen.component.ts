import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocalCraftsman } from './models/local-craftsman';
import { Subscription } from 'rxjs';
import { LocalCraftsmenService } from './local-craftsmen.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../../core/services/alert.service';
import { LocalCraftsmanDialogComponent } from './components/local-craftsman-dialog/local-craftsman-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-local-craftsmen',
  templateUrl: './local-craftsmen.component.html',
  styleUrl: './local-craftsmen.component.scss',
})
export class LocalCraftsmenComponent implements OnInit, OnDestroy {
  localCraftsmanSearchForm: FormGroup;
  localCraftsmen: LocalCraftsman[] = [];
  dataSource = new MatTableDataSource<LocalCraftsman>();

  searchAttempted: boolean = false;

  subscriptions: Subscription[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(FormGroupDirective)
  private localCraftsmanSearchFormDir!: FormGroupDirective;

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
    this.loadLocalCraftsmen();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }

  loadLocalCraftsmen(): void {
    const subscription = this.localCraftsmenService
      .getAllLocalCraftsmen()
      .subscribe({
        next: (localCraftsmen) => {
          this.searchAttempted = false;
          this.localCraftsmen = localCraftsmen || [];
          this.dataSource.data = this.localCraftsmen;
        },
        error: (err) => {
          this.dataSource.data = [];
          this.searchAttempted = true;
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
            this.searchAttempted = false;
            this.localCraftsmen = [localCraftsman];
            this.dataSource.data = this.localCraftsmen;
          },
          error: (err) => {
            this.dataSource.data = [];
            this.searchAttempted = true;
            console.error(`Failed to load local craftsman with ID ${this.localCraftsmanSearchForm.value.id}`, err);
          }
        });
      this.subscriptions.push(subscription);
    }
  }

  onClean(): void {
    this.searchAttempted = false;
    this.localCraftsmanSearchFormDir.resetForm();
    this.loadLocalCraftsmen();
  }

  onCreateLocalCraftsman(): void {
    this.matDialog
      .open(LocalCraftsmanDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const { localCraftsmanData, image } = result;
          this.localCraftsmenService
            .addLocalCraftsmen(localCraftsmanData, image)
            .subscribe({
              next: () => {
                this.loadLocalCraftsmen(),
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
            this.localCraftsmenService
              .updateLocalCraftsmen(localCraftsman.id, localCraftsmanData, image)
              .subscribe({
                next: () => {
                  this.loadLocalCraftsmen(),
                  this.toastService.showToast("Se actualizó el artesano correctamente");
                },
                error: (err) => console.error('Error updating local craftsman', err)
              });
          }
        },
        error: (err) => console.error('Failed to open local craftsman dialog', err),
      });
  }

  onDeleteLocalCraftsman(id: string): void {
    this.alertService
      .showConfirmDeleteAction('este artesano')
      .then(result => {
        if (result.isConfirmed) {
          const deleteSubscription = this.localCraftsmenService
            .deleteLocalCraftsmenByID(id)
            .subscribe({
              next: () => {
                this.loadLocalCraftsmen(),
                this.toastService.showToast("Se eliminó el artesano correctamente");
              },
              error: (err) => console.error('Failed to delete local craftsman', err)
            });
          this.subscriptions.push(deleteSubscription);
        }
      });
  }
}
