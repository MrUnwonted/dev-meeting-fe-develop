import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SearchPropertyTaxDetailsComponent } from '../search-property-tax-details/search-property-tax-details.component';

@Component({
  selector: 'app-search-property-tax',
  templateUrl: './search-property-tax.component.html',
  styleUrl: './search-property-tax.component.scss',
})
export class SearchPropertyTaxComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selected_rec: any;
  transaction_list: any = [];
  data_list: any = [];
  displayedColumns: string[] = [
    'builId',
    'wardNo',
    'houseNo',
    'owner',
    'houseName',
    'place',
    'select',
  ];

  dataSource = new MatTableDataSource<any>();

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<any>
  ) {}

  ngOnInit() {
    this.data_list = [
      {
        builId: 1,
        wardNo: 101,
        houseNo: 101,
        owner: 'Alex David',
        houseName: 'Yamuna',
        place: 'Ulloor',
      },
      {
        builId: 2,
        wardNo: 102,
        houseNo: 102,
        owner: 'Arun Gopal',
        houseName: 'Aun',
        place: 'Med College',
      },
      {
        builId: 3,
        wardNo: 103,
        houseNo: 103,
        owner: 'Renjith Revi',
        houseName: 'Revi',
        place: 'Kesavadasapuram',
      },
      {
        builId: 4,
        wardNo: 104,
        houseNo: 104,
        owner: 'Suhas Prem',
        houseName: 'Prem',
        place: 'Ullor',
      },
    ];

    this.dataSource = new MatTableDataSource(this.data_list);
    this.dataSource.paginator = this.paginator;
  }

  openTableRow() {
    var dialogRef = this.dialog.open(SearchPropertyTaxDetailsComponent, {
      width: '1024px',
      data: { moduleId: 41 },
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (response && response.data) {
        const row = response.data;
        this.selected_rec = row;
        // Optionally close the parent if you need to return selection
        this.dialogRef.close({ data: this.selected_rec });
        console.log(response);
      }
    });
  }
}
