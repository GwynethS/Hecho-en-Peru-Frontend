import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LocalCraftsman } from '../../models/local-craftsman';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-local-craftsman-table',
  templateUrl: './local-craftsman-table.component.html',
  styleUrl: './local-craftsman-table.component.scss',
})
export class LocalCraftsmanTableComponent implements AfterViewInit {
  @Input()
  set dataSource(dataSource: MatTableDataSource<LocalCraftsman>) {
    this._dataSource = dataSource;
    if (this.paginator) {
      this._dataSource.paginator = this.paginator;
    }
  }

  get dataSource(): MatTableDataSource<LocalCraftsman> {
    return this._dataSource;
  }

  @Output()
  editLocalCraftsman = new EventEmitter<LocalCraftsman>();

  @Output()
  deleteLocalCraftsman = new EventEmitter<string>();

  displayedColumns: string[] = [
    'id',
    'fullName',
    'specialty',
    'experience',
    'region',
    'enabled',
    'actions',
  ];

  _dataSource = new MatTableDataSource<LocalCraftsman>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    if (this.paginator) {
      this._dataSource.paginator = this.paginator;
    }
  }

  onViewLocalCraftsmanDetails(id: string) {
    this.router.navigate([`/admin/local-craftsmen/${id}`]);
  }
}
