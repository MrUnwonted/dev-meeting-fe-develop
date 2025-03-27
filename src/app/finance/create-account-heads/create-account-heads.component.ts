import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SearchSecondaryHeadsComponent } from '../modals/search-secondary-heads/search-secondary-heads.component';

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


  constructor(
        private dialog: MatDialog
    
  ) { }
  ngOnInit(): void {
    // Initialize paginator
    this.dataSource = new MatTableDataSource(this.SubjectData);
    this.dataSource.paginator = this.paginator;
  }


  open_heads(){
      const dialogRef = this.dialog.open(SearchSecondaryHeadsComponent, {
          width: '1130px',
        });
        dialogRef?.afterClosed().subscribe((response: any) => {

        });
  }

}
