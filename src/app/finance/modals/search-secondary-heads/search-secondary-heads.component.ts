import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  displayedColumns: string[] = ['code', 'head', 'type', 'primary_head'];
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
    private svr: ServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data?.source === 'bankHead') {
      this.fetch_heads('bankHead');
    } else {
      this.fetch_heads('accountHead');
    }
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

  // // Fetch data from API
  // fetch_heads() {
  //   this.svr
  //     .fin_getService('api/v0/get_secondary_heads')
  //     .subscribe((res: any) => {
  //       if (res && Array.isArray(res)) {
  //         // Filter records where vch_secondary_code starts with "450" and head is NOT "Cash"
  //         this.head_list = res.filter(
  //           (item) =>
  //             item.vch_secondary_code.startsWith('450') &&
  //             item.vch_secondary_head !== 'Cash'
  //         );
  //         this.dataSource = new MatTableDataSource(this.head_list);
  //         this.dataSource.paginator = this.paginator;
  //         // console.log('Filtered Head List:', this.head_list);
  //       } else {
  //         Swal.fire({
  //           icon: 'info',
  //           title: 'Info',
  //           text: 'Failed to fetch data. Please try again.',
  //         });
  //       }
  //     });
  // }
  // Accepts an optional filterType to differentiate logic
  fetch_heads(filterType: 'accountHead' | 'bankHead' = 'accountHead') {
    this.svr
      .fin_getService('api/v0/get_secondary_heads')
      .subscribe((res: any) => {
        if (res && Array.isArray(res)) {
          if (filterType === 'accountHead') {
            // Component 1: Account Head filter
            this.head_list = res; // No filter or apply another logic here if needed
          } else if (filterType === 'bankHead') {
            // Component 2: Bank Head filter
            this.head_list = res.filter(
              (item) =>
                item.vch_secondary_code.startsWith('450') &&
                item.vch_secondary_head !== 'Cash'
            );
          }
          this.dataSource = new MatTableDataSource(this.head_list);
          this.dataSource.paginator = this.paginator;
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Info',
            text: 'Failed to fetch data. Please try again.',
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
