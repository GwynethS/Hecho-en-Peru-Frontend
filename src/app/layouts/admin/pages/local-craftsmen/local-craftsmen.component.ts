import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocalCraftsman } from './models/local-craftsman';
import { Subscription } from 'rxjs';
import { LocalCraftsmenService } from './local-craftsmen.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../../core/services/alert.service';
import { LocalCraftsmanDialogComponent } from './components/local-craftsman-dialog/local-craftsman-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-local-craftsmen',
  templateUrl: './local-craftsmen.component.html',
  styleUrl: './local-craftsmen.component.scss',
})
export class LocalCraftsmenComponent implements OnInit, OnDestroy, AfterViewInit {
  localCraftsmen: LocalCraftsman[] = [];
  dataSource = new MatTableDataSource<LocalCraftsman>();
  localCraftsmanSearchForm: FormGroup;
  subscriptions: Subscription[] = [];
  searchAttempted: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private localCraftsmenService: LocalCraftsmenService,
    private matDialog: MatDialog,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.localCraftsmanSearchForm = this.fb.group({
      id: this.fb.control('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadAllLocalCraftsmen();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((suscription) => suscription.unsubscribe());
  }

  loadAllLocalCraftsmen(): void {
    this.subscriptions.push(
      this.localCraftsmenService.getLocalCraftsmen().subscribe({
        next: (localCraftsmen) => {
          this.localCraftsmen = localCraftsmen || [];
          this.dataSource.data = this.localCraftsmen;
          console.log(localCraftsmen);
        },
        error: (err) => {
          this.localCraftsmen = [];
          this.dataSource.data = this.localCraftsmen;
          console.error('Failed to load local craftsmen', err);
        }
      })
    );
  }

  onSearch(): void {
    if (this.localCraftsmanSearchForm.invalid) {
      this.localCraftsmanSearchForm.markAllAsTouched();
    } else {
      this.subscriptions.push(
        this.localCraftsmenService.getSearchLocalCraftsmanDetailsByID(this.localCraftsmanSearchForm.value.id).subscribe({
          next: (localCraftsmen) => {
            this.localCraftsmen = localCraftsmen ? [localCraftsmen] : [];
            console.log(this.localCraftsmen);
            this.searchAttempted = true;
          },
          error: (err) => {
            this.localCraftsmen = [];
            this.searchAttempted = true;
            console.error(`Failed to load local craftsman with ID ${this.localCraftsmanSearchForm.value.id}`, err);
          }
        })
      );
    }
  }

  onClean(): void {
    this.localCraftsmanSearchForm.reset();
    this.loadAllLocalCraftsmen();
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
                    this.dataSource.data = this.localCraftsmen;
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
                    this.dataSource.data = this.localCraftsmen;
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
                this.dataSource.data = this.localCraftsmen;
              },
            });
        }
      });
  }
}
