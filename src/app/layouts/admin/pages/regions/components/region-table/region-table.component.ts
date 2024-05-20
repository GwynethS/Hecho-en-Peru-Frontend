import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Region } from '../../models/region';

@Component({
  selector: 'app-region-table',
  templateUrl: './region-table.component.html',
  styleUrl: './region-table.component.scss'
})
export class RegionTableComponent {
  @Input()
  dataSource: Region[] = [];

  @Output()
  editRegion = new EventEmitter<Region>();

  displayedColumns: string[] = ['regionId', 'name', 'history', 'siteIntroduction', 'craftsmenIntroduction', 'actions'];

  constructor() {}
}
