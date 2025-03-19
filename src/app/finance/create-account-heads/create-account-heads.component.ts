import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-create-account-heads',
  templateUrl: './create-account-heads.component.html',
  styleUrls: ['./create-account-heads.component.scss']
})



export class CreateAccountHeadsComponent implements OnInit {

  

  SubjectData:any = [
    { type: 'Income', code: '1000001', head: 'Sales (Revenue Account)'},
    { type: 'Income', code: '1000001', head: 'Sales (Revenue Account)'},
    { type: 'Income', code: '1000001', head: 'Sales (Revenue Account)'},
    { type: 'Income', code: '1000001', head: 'Sales (Revenue Account)'},
    { type: 'Income', code: '1000001', head: 'Sales (Revenue Account)'},
    { type: 'Income', code: '1000001', head: 'Sales (Revenue Account)'},
    
  ];

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['type', 'code', 'head'];
  dataSource = new MatTableDataSource<any>;


  constructor() { }
  ngOnInit(): void {
    // Initialize paginator
    this.dataSource.paginator = this.paginator;
  }


}
