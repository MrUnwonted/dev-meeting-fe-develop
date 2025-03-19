import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pagination-table',
  templateUrl: './pagination-table.component.html',
  styleUrls: ['./pagination-table.component.scss']
})
export class PaginationTableComponent implements OnInit {

 
  @Input() dataSource!: MatTableDataSource<any>;
  @Input() displayedColumns!: string[];
  @Output() recordSelected = new EventEmitter<any>();

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement | null;
    if (inputElement) {
      this.dataSource.filter = inputElement.value.trim().toLowerCase();
    }
  }


  selectRecord(record: any) {
    console.log("table");
    
    this.recordSelected.emit(record);
  }

}
