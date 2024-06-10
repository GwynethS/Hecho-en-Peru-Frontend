import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TouristSite } from '../../models/tourist-site';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-tourist-site-table',
  templateUrl: './tourist-site-table.component.html',
  styleUrl: './tourist-site-table.component.scss'
})
export class TouristSiteTableComponent implements AfterViewInit {
  @Input()
  set dataSource(dataSource: MatTableDataSource<TouristSite>) {
    this._dataSource = dataSource;
    if (this.paginator) {
      this._dataSource.paginator = this.paginator;
    }
  }

  get dataSource(): MatTableDataSource<TouristSite> {
    return this._dataSource;
  }

  @Output()
  editTouristSite = new EventEmitter<TouristSite>();

  @Output()
  deleteTouristSite = new EventEmitter<string>();

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'actions',
  ];

  _dataSource = new MatTableDataSource<TouristSite>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngAfterViewInit() {
    if (this.paginator) {
      this._dataSource.paginator = this.paginator;
    }
  }
}
