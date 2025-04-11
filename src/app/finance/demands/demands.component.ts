import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
  transaction_options = [
    { "id": 1, label: 'Ordinary' },
    { "id": 2, label: 'Property Tax' },
  ];

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
  
  constructor(){
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

}
