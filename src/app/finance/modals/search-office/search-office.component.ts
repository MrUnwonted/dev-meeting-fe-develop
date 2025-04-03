import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-office',
  templateUrl: './search-office.component.html',
  styleUrl: './search-office.component.scss',
})
export class SearchOfficeComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['code', 'unit'];
  dataSource = new MatTableDataSource<any>();
  head_list: any = [];
  activeRowIndex: number | null = null;
  selected_data: any;
  is_message: boolean = true;
  rowColors: string[] = [];

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
    console.log('Selected Data:', this.selected_data);
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

  fetch_heads() {
    this.svr.fin_getService('api/v0/get_units').subscribe((res: any) => {
      if (res) {
        this.head_list = res;
        this.dataSource = new MatTableDataSource(this.head_list);
        this.dataSource.paginator = this.paginator;
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Infor',
          text: 'Failed to fetch Data. Please try again.',
        });
      }
    });
  }

  // for filter while search
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
