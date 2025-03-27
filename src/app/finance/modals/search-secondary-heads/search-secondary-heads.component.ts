import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-secondary-heads',
  templateUrl: './search-secondary-heads.component.html',
  styleUrl: './search-secondary-heads.component.scss',
})
export class SearchSecondaryHeadsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  activeRowIndex: number | null = null;
  selected_data: any;
  rowColors: string[] = [];
  head_list: any = [];
  is_message: boolean = true;
  displayedColumns: string[] = ['type', 'code', 'head'];
  dataSource = new MatTableDataSource<any>();

  // Modal footer buttons
  modalButtons = [
    {
      text: 'Cancel',
      className: 'btn btn-outline-primary-90 xs',
      action: this.closeModal.bind(this),
    },
    {
      text: 'Select',
      className: 'btn btn-primary-90 xs',
      action: this.select_row.bind(this),
    },
  ];

  constructor(
    private dialogRef: MatDialogRef<any>,
    private svr: ServiceService
  ) {}

  ngOnInit(): void {
    this.fetch_heads();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  closeModal(): void {
    this.dialogRef.close({});
  }

  rowActive(row: any, index: number) {
    this.activeRowIndex = index;
    this.selected_data = row;
    // console.log('Selected Data:', this.selected_data);
    this.rowColors = this.rowColors.map(() => '');
    this.rowColors[index] = '#ff0000';
  }
  select_row() {
    if (this.selected_data) {
      this.dialogRef.close({
        result: 'selected data',
        data: this.selected_data,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Please Select A Record',
      });
    }
  }

  // Fetch data from API
  fetch_heads() {
    // Check if data is available in cache
    if (this.head_list.length > 0) {
      this.dataSource = new MatTableDataSource(this.head_list);
      this.dataSource.paginator = this.paginator;
      // console.log('Loaded from cache');
      return;
    }
    this.svr
      .fin_getService('api/v0/get_secondary_heads')
      .subscribe((res: any) => {
        this.head_list = res;
        this.dataSource = new MatTableDataSource(this.head_list);
        this.dataSource.paginator = this.paginator;
        // console.log('Loaded from API');
      });
  }

  // for filter while search
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
