import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-search-office',
  templateUrl: './search-office.component.html',
  styleUrl: './search-office.component.scss'
})
export class SearchOfficeComponent {


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [  'code', 'unit'];
  dataSource = new MatTableDataSource<any>;
  head_list: any;

  // Modal footer buttons
  modalButtons = [

    {
      text: 'Cancel',
      className: 'btn btn-outline-primary-90 xs',
      action: this.closeModal.bind(this)
    },
    {
      text: 'Select',
      className: 'btn btn-primary-90 xs',
      action: this.select_row.bind(this)
    },
  ];

  constructor(private dialogRef: MatDialogRef<any>,
    private svr: ServiceService
  ) { }
  ngOnInit(): void {

    this.fetch_heads();

  }

  closeModal(): void {
    this.dialogRef.close({});
  }

  select_row() {
  }

  fetch_heads() {
    this.svr.fin_getService("api/v0/get_units").subscribe((res: any) => {
      this.head_list = res;
      this.dataSource = new MatTableDataSource(this.head_list);
      this.dataSource.paginator = this.paginator;

    });
  }


    // for filter while search
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }



}
