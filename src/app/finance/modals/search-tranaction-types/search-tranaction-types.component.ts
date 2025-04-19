import { Component, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-tranaction-types',
  templateUrl: './search-tranaction-types.component.html',
  styleUrl: './search-tranaction-types.component.scss',
})
export class SearchTranactionTypesComponent {
  selected_rec: any;
  transaction_list: any = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['slNo', 'transaction_type'];
  activeRowIndex: any;
  rowColors: string[] = [];
  transaction_options: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  modalButtons = [
    {
      text: 'Close',
      className: 'btn btn-outline-primary-90 xs',
      action: this.closeDialog.bind(this),
    },
    {
      text: 'Select',
      className: 'btn btn-primary-90 xs',
      action: this.navigateToSearch.bind(this),
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    // private router: Router
    private svr: ServiceService
  ) {}

  ngOnInit(): void {
    // this.transaction_options = [
    //   { id: 1, transaction_type: 'Ordinary' },
    //   { id: 2, transaction_type: 'Property Tax' },
    //   { id: 3, transaction_type: 'Profession Tax' },
    //   { id: 4, transaction_type: 'Tender Form' },
    //   { id: 5, transaction_type: 'Sales Form' },
    //   { id: 6, transaction_type: 'Road Cutting Charge' },
    // ];
    this.fetch_transactions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  closeDialog(): void {
    // Send data back to the parent component
    this.dialogRef.close({
      result: 'Data from dialog',
      data: this.selected_rec,
    });
  }

  fetch_transactions() {
    let param = {
      group_id: 1,
    };
    this.svr
      .fin_getService('api/v0/get_transaction_types', param)
      .subscribe((res: any) => {
        this.transaction_options = res;
        this.dataSource = new MatTableDataSource(this.transaction_options);
        this.dataSource.paginator = this.paginator;
      });
  }

  clear_filters() {}

  // rowActive(row: any, index: number) {
  //   this.selected_rec = row;
  // }
  rowActive(row: any, index: number) {
    this.activeRowIndex = index;
    this.selected_rec = row;
    // console.log('Selected Data:', this.selected_data);
    this.rowColors = this.rowColors.map(() => '');
    this.rowColors[index] = '#ff0000';
  }

  navigateToSearch(): void {
    if (this.selected_rec) {
      this.dialogRef.close({
        result: 'Data from dialog',
        data: this.selected_rec,
      });
    } else {
      Swal.fire({
        icon: 'info',
        text: 'Please select one record and continue !',
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPaginationOffset(): number {
    return (this.paginator?.pageIndex || 0) * (this.paginator?.pageSize || 0);
  }
}
