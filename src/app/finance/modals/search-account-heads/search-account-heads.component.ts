import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-account-heads',
  templateUrl: './search-account-heads.component.html',
  styleUrl: './search-account-heads.component.scss',
})
export class SearchAccountHeadsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  activeRowIndex: number | null = null;
  selected_data: any;
  rowColors: string[] = [];
  head_list: any = [];
  is_message: boolean = true;
  displayedColumns: string[] = ['code', 'head', 'secondary', 'primary_head'];
  dataSource = new MatTableDataSource<any>();

  // Modal footer buttons
  modalButtons = [
    {
      text: 'Cancel',
      className: 'btn btn-outline-primary-90 xs',
      action: this.closeModal.bind(this),
    },
    {
      text: 'Select',
      className: 'btn btn-primary-90 xs',
      action: this.select_row.bind(this),
    },
  ];

  constructor(
    private dialogRef: MatDialogRef<any>,
    private svr: ServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any // Receive passed data
  ) {}

  ngOnInit(): void {
    this.fetch_heads();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  closeModal(): void {
    this.dialogRef.close({});
  }

  rowActive(row: any, index: number) {
    this.activeRowIndex = index;
    this.selected_data = row;
    this.rowColors = this.rowColors.map(() => '');
    this.rowColors[index] = '#ff0000';
  }

  select_row() {
    if (this.selected_data) {
      this.dialogRef.close({
        result: 'selected data',
        data: this.selected_data,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Please Select A Record',
      });
    }
  }
  // Fetch data based on the passed parameter
  fetch_heads() {
    if (!this.data || !this.data.filterParam) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Data',
        text: 'No filter parameter received. Unable to fetch data.',
      });
      return;
    }

    let param = {
      filter: 'secondary', // Match the filter from BanksComponent
      id: this.data.filterParam, // Use the passed filterParam as id
    };

    console.log('#Fetching Data with Param:', param);

    this.svr.fin_postservice('api/v0/get_heads', param).subscribe(
      (res: any) => {
        console.log('##res',res)
        if (res) {
          this.head_list = res;
          this.dataSource = new MatTableDataSource(this.head_list);
          this.dataSource.paginator = this.paginator;
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Info',
            text: 'Failed to fetch Data. Please try again.',
          });
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch data.',
        });
      }
    );
  }

  // Apply filter for search
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
