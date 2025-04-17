import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-tranaction-types',
  templateUrl: './search-tranaction-types.component.html',
  styleUrl: './search-tranaction-types.component.scss'
})
export class SearchTranactionTypesComponent {

  selected_rec: any;
  data_list: any =[];
  transaction_list:any=[] ;
  primary_subjects:any=[];
  sub_subjects:any=[] ;
  search_item:any;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['slNo', 'transaction_type'];
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
  ) { }

  ngOnInit(): void {
    this.transaction_options =   [
      { "id": 1, "transaction_type": 'Ordinary' },
      { "id": 2, "transaction_type": 'Property Tax' },
      { "id": 3, "transaction_type": 'Profession Tax' },
      { "id": 4, "transaction_type": 'Tender Form' },
      { "id": 5, "transaction_type": 'Sales Form' },
      { "id": 6, "transaction_type": 'Road Cutting Charge' },
  
  
    ];
    this.fetch_transactions();
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

  fetch_transactions(){
    

    this.dataSource = new MatTableDataSource(this.transaction_options);

  }

  getPaginationOffset(): number {
    return (this.paginator?.pageIndex || 0) * (this.paginator?.pageSize || 0);
  }

}
