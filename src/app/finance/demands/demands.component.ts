import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SearchTranactionTypesComponent } from '../modals/search-tranaction-types/search-tranaction-types.component';
import { SearchBanksComponent } from '../modals/search-banks/search-banks.component';
import { SearchApplicantComponent } from '../modals/search-applicant/search-applicant.component';
import { SearchPropertyTaxComponent } from '../modals/search-property-tax/search-property-tax.component';

@Component({
  selector: 'app-demands', 
  templateUrl: './demands.component.html',
  styleUrl: './demands.component.scss'
})
export class DemandsComponent {

  trn_list:any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['sl', 'headCode', 'head', 'year', 'period', 'amount'];
  dataSource = new MatTableDataSource<any>;
  selectedDate: Date | null = null;
  selectedOption:any;
  

  selectedType:any;
  instrument_options = [
    { "id": 1, label: 'DD' },
    { "id": 2, label: 'Cheque' },
  ];
  collection_options = [
    { "id": 1, label: 'Direct Collection' },
    { "id": 2, label: 'OutDoor Collection' },
  ];

  selected_collection_option:any;

  cash_mode: any;
  
  constructor( 
       private dialog: MatDialog,
  ){

    
    this.selectedOption =1;
    this.cash_mode = "1";

  }


  ngOnInit(){
    this.trn_list =[
      { sl: 1, headCode: '101', head: 'Loreum Ipsum', year: 1020, period: 1020, amount: 1020 },
      { sl: 2, headCode: '102', head: 'Loreum Ipsum', year: 420, period: 420, amount: 420 },
      { sl: 3, headCode: '103', head: 'Loreum Ipsum', year: 140, period: 140, amount: 140 },
      { sl: 4, headCode: '104', head: 'Loreum Ipsum', year: 70, period: 70, amount: 70 },
      { sl: 5, headCode: '105', head: 'Loreum Ipsum', year: 1270, period: 1270, amount: 1270 },
      { sl: 6, headCode: '106', head: 'Loreum Ipsum', year: 10020, period: 10020, amount: 10020 },
      { sl: 7, headCode: '107', head: 'Loreum Ipsum', year: 6020, period: 6020, amount: 6020 },
      { sl: 8, headCode: '107', head: 'Loreum Ipsum', year: 5020, period: 5020, amount: 5020 },
    ];

    this.dataSource = new MatTableDataSource(this.trn_list);
    

  }

  fetch_trn_list(){

  }


  onOptionChange(value: any): void {
    console.log(value);
    
    this.selectedOption = value;
    
  }

  
  open_transactions() {
    const dialogRef = this.dialog.open(SearchTranactionTypesComponent, {
      width: '1130px',
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (response && response.data) {
        if(response.data.id.toString()=="2") {
          this.search_property_tax();
        }
        console.log(response);
        
      }
    });
  }

  open_bank() {
    const dialogRef = this.dialog.open(SearchBanksComponent, {
      width: '1130px',
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (response && response.data) {
      }
    });
  }

  Search_applicant(){
    const dialogRef = this.dialog.open(SearchApplicantComponent, {
      width: '1130px',
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (response && response.data) {
      }
    });
  }

  search_property_tax(){
    const dialogRef = this.dialog.open(SearchPropertyTaxComponent, {
      width: '1130px',
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (response && response.data) {
      }
    });
  
   }

}
