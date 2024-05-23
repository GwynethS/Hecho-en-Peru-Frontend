import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocalCraftsman } from '../../models/local-craftsman';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-local-craftsman-table',
  templateUrl: './local-craftsman-table.component.html',
  styleUrl: './local-craftsman-table.component.scss',
})
export class LocalCraftsmanTableComponent {
  @Input()
  dataSource!: MatTableDataSource<LocalCraftsman>;

  @Output()
  editLocalCraftsman = new EventEmitter<LocalCraftsman>();

  @Output()
  deleteLocalCraftsman = new EventEmitter<LocalCraftsman>();

  displayedColumns: string[] = [
    'id',
    'fullName',
    'specialty',
    'experience',
    'name_region',
    'enabled',
    'actions',
  ];

  constructor() {}
}
