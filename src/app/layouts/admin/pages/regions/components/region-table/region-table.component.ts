import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Region } from '../../models/region';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-region-table',
  templateUrl: './region-table.component.html',
  styleUrl: './region-table.component.scss',
})
export class RegionTableComponent implements AfterViewInit {
  @Input()
  set dataSource(data: Region[]) {
    this._dataSource.data = data;
  }

  get dataSource(): Region[] {
    return this._dataSource.data;
  }

  @Output()
  editRegion = new EventEmitter<Region>();

  displayedColumns: string[] = [
    'id',
    'name',
    'history',
    'sitesIntroduction',
    'craftsmenIntroduction',
    'actions',
  ];

  _dataSource = new MatTableDataSource<Region>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngAfterViewInit() {
    this._dataSource.paginator = this.paginator;
  }
}
