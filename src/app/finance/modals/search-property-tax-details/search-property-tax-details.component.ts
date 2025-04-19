import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SearchApplicantComponent } from '../search-applicant/search-applicant.component';

@Component({
  selector: 'app-search-property-tax-details',

  templateUrl: './search-property-tax-details.component.html',
  styleUrl: './search-property-tax-details.component.scss',
})
export class SearchPropertyTaxDetailsComponent {
  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<any>
  ) {}

  displayedColumns: string[] = [
    'year',
    'firstHalf',
    'secondHalf',
    'amount',
    'arier',
    'check',
  ];
  dataSource = new MatTableDataSource<any>();

  data_list: any = [];
  selected_data: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modal footer buttons
  modalButtons = [
    {
      text: 'Cancel',
      className: 'btn btn-outline-primary-90 xs',
      action: this.closeModal.bind(this),
    },
    {
      text: 'Copy to Record',
      className: 'btn btn-primary-90 xs',
      action: this.copyToRecord.bind(this),
    },
  ];

  ngOnInit(): void {
    this.data_list = [
      { year: 2024, firstHalf: 50, secondHalf: 50, amount: 100.0, arier: 10.0 },
      {
        year: 2023,
        firstHalf: 100,
        secondHalf: 100,
        amount: 200.0,
        arier: 50.0,
      },
      { year: 2022, firstHalf: 50, secondHalf: 50, amount: 100.0, arier: 20.0 },
      { year: 2021, firstHalf: 80, secondHalf: 80, amount: 160.0, arier: 10.0 },
    ];
    this.selected_data = this.data_list[0];
    this.dataSource = new MatTableDataSource(this.data_list);
    // Initialize paginator
    this.dataSource.paginator = this.paginator;
  }

  closeModal(): void {
    this.dialogRef.close({});
  }

  Search_applicant() {
    const dialogRef = this.dialog.open(SearchApplicantComponent, {
      width: '1130px',
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (response && response.data) {
      }
    });
  }

  copyToRecord() {
    // Logic to handle copying selected_data to a record
    console.log(this.selected_data);
  }
}
