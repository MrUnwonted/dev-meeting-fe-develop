import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SearchSecondaryHeadsComponent } from '../modals/search-secondary-heads/search-secondary-heads.component';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-create-account-heads',
  templateUrl: './create-account-heads.component.html',
  styleUrls: ['./create-account-heads.component.scss'],
})
export class CreateAccountHeadsComponent implements OnInit {
  selected_acc_head = {
    parent_head: '',
    head_code: '',
    head: '',
    short_description: '',
    primary: '',
    secondary: '',
  };
  type: any;
  head_list: any = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['type', 'code', 'head'];
  dataSource = new MatTableDataSource<any>();

  constructor(private dialog: MatDialog, private svr: ServiceService) {}

  ngOnInit(): void {
    // Initialize paginator
    this.fetch_heads();
    this.dataSource.paginator = this.paginator;
  }

  open_heads() {
    const dialogRef = this.dialog.open(SearchSecondaryHeadsComponent, {
      width: '1130px',
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (response && response.data) {
        const userData = response.data;
        this.selected_acc_head = {
          parent_head: userData.vch_primary_head,  // Map to vch_primary_head
          head_code: userData.vch_secondary_code,  // Map to vch_secondary_code
          head: userData.vch_secondary_head,       // Map to vch_secondary_head
          short_description: "",                   // No equivalent in API, set as empty
          primary: userData.int_primary_id,        // Map to int_primary_id
          secondary: userData.int_secondary_id,    // Map to int_secondary_id
        };
        console.log('Selected Acc Head:', this.selected_acc_head);
      }
    });
  }


  // Fetch data from API
  fetch_heads() {
    // Check if data is available in cache
    if (this.head_list.length > 0) {
      this.dataSource = new MatTableDataSource(this.head_list);
      this.dataSource.paginator = this.paginator;
      console.log('Loaded from cache');
      return;
    }
    this.svr
      .fin_getService('api/v0/get_secondary_heads')
      .subscribe((res: any) => {
        this.head_list = res;
        this.dataSource = new MatTableDataSource(this.head_list);
        this.dataSource.paginator = this.paginator;
        console.log('Loaded from API');
      });
  }
}
