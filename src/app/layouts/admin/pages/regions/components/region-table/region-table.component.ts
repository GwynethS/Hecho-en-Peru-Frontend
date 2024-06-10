import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Region } from '../../models/region';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-region-table',
  templateUrl: './region-table.component.html',
  styleUrl: './region-table.component.scss',
})
export class RegionTableComponent implements AfterViewInit {
  @Input()
  set dataSource(dataSource: MatTableDataSource<Region>) {
    this._dataSource = dataSource;
    if (this.paginator) {
      this._dataSource.paginator = this.paginator;
    }
  }

  get dataSource(): MatTableDataSource<Region> {
    return this._dataSource;
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

  constructor(private router: Router) {}

  ngAfterViewInit() {
    if (this.paginator) {
      this._dataSource.paginator = this.paginator;
    }
  }

  onViewTouristSites(id: string) {
    this.router.navigate([`/admin/regions/${id}`]);
  }
}
