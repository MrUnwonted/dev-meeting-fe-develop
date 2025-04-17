import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-banks',
  templateUrl: './search-banks.component.html',
  styleUrl: './search-banks.component.scss'
})
export class SearchBanksComponent {
selected_rec: any;
  data_list: any =[];
  transaction_list:any=[] ;
  primary_subjects:any=[];
  sub_subjects:any=[] ;
  search_item:any;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['SlNo','bank',    'accountno',    'code',    'short_description',    'head',];
  activeRowIndex:any;


  modalButtons = [
    { text: 'Close', className: 'btn btn-outline-primary-90 xs', action: this.closeDialog.bind(this) },
    { text: 'Select', className: 'btn btn-primary-90 xs', action: this.navigateToSearch.bind(this) }
  ];

  transaction_options:any =[];
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>,
    private router: Router,
     private svr: ServiceService
  ) { }

  ngOnInit(): void {
   
    this.fetch_records();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  closeDialog(): void {
    // Send data back to the parent component
    this.dialogRef.close({ result: 'Data from dialog', "data": this.selected_rec });

  }
  
  navigateToSearch(): void {

    if(this.selected_rec) {
      this.dialogRef.close({ result: 'Data from dialog', "data": this.selected_rec });

    } else{
      
      Swal.fire({

        icon: 'info',

        text: 'Please select one record and continue !'

      });
    }
  }

  clear_filters(){

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  rowActive(row: any, index: number) {
    this.selected_rec = row;

  }

  fetch_records(){

    let param = {
      unit_id: 1,
    };
    this.svr.fin_getService('api/v0/get_bank_list', param).subscribe(
      (res: any) => {
        const data_list = res;
        this.dataSource = new MatTableDataSource(data_list);
        this.dataSource.paginator = this.paginator;
      });
    

    this.dataSource = new MatTableDataSource(this.transaction_options);
    this.dataSource.paginator = this.paginator;

  }

}
