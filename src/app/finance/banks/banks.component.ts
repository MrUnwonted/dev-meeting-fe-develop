import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SearchOfficeComponent } from '../modals/search-office/search-office.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.scss'
})
export class BanksComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['bank','accountno', 'code', 'head' ];
  dataSource = new MatTableDataSource<any>;

  data_list:any;

  constructor(  private dialog: MatDialog){

  }

  ngOnInit(): void {

    this.fetch_records();
  }



  fetch_records(){
    this.data_list =  [
      { code: '4002015', bank: 'ICICI', accountno: '522 000 1022 036'},
      { code: '4002015', bank: 'ICICI', accountno: '522 000 1022 036'},
      { code: '4002015', bank: 'ICICI', accountno: '522 000 1022 036'},
      { code: '4002015', bank: 'ICICI', accountno: '522 000 1022 036'},

    ];

    this.dataSource = new MatTableDataSource(this.data_list);
    this.dataSource.paginator = this.paginator;

  }


  open_units(){
      const dialogRef = this.dialog.open(SearchOfficeComponent, {
              width: '1130px',
            });
            dialogRef?.afterClosed().subscribe((response: any) => {

            });
  }
}
