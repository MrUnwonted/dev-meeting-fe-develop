import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SearchSecondaryHeadsComponent } from '../modals/search-secondary-heads/search-secondary-heads.component';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-account-heads',
  templateUrl: './create-account-heads.component.html',
  styleUrls: ['./create-account-heads.component.scss'],
})
export class CreateAccountHeadsComponent implements OnInit {
  @Output() expandToggled = new EventEmitter<void>();
  isExpanded = false;
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    this.expandToggled.emit();
  }
  selected_acc_head: any = {
    // parent_head: '',
    // head_code: '',
    // head: '',
    // short_description: '',
    // primary: '',
    // secondary: '',
    // type: '',
  };
  head_list: any = [];
  isEditing: boolean = false;
  isAdding: boolean = false;
  isReadOnly: boolean = true; // Controls form field interactivity
  activeRowIndex: number | null = null;
  rowColors: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['code', 'head', 'primary'];
  dataSource = new MatTableDataSource<any>();

  constructor(private dialog: MatDialog, private svr: ServiceService) {}

  ngOnInit(): void {
    // Initialize paginator
    this.init();
    this.fetch_heads();
    this.dataSource.paginator = this.paginator;
  }

  init() {
    this.isReadOnly = false;
    this.isAdding = true;
    this.isEditing = false;
    this.selected_acc_head = {
      parent_head: '',
      head_code: '',
      head: '',
      short_description: '',
      primary: '',
      secondary: '',
      type: '',
    };
  }

  open_heads() {
    if (this.isAdding) {
      const dialogRef = this.dialog.open(SearchSecondaryHeadsComponent, {
        width: '1130px',
      });
      dialogRef?.afterClosed().subscribe((response: any) => {
        if (response && response.data) {
          const userData = response.data;
          this.selected_acc_head = {
            parent_head: userData.vch_secondary_head, // Map to vch_secondary_head
            head: userData.vch_secondary_head, // Map to vch_primary_head
            primary: userData.vch_primary_head, // Map to int_primary_id
            secondary: userData.int_secondary_id, // Map to int_secondary_id
            type: userData.vch_type, // Map to int_secondary_id
            head_code: '',
          };
          // Fetch new head code
          this.getNewHeadCode(userData.int_secondary_id);
          // console.log('Selected Acc Head:', this.selected_acc_head);
          this.isEditing = true;
          this.isReadOnly = true;
        }
      });
    }
  }

  getNewHeadCode(sec_id: number) {
    this.svr.fin_getService('api/v0/get_new_head_code', { sec_id }).subscribe(
      (res: any) => {
      if (res) {
        this.selected_acc_head.head_code = res;
        // Display success message
      }
      },
      (error) => {
      console.error('Error fetching head code:', error);
      // Display error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch head code. Please try again.',
      });
      }
    );
  }

  save() {
    if (!this.selected_acc_head.head || !this.selected_acc_head.head_code) {
      console.error("Head and Head Code are required!");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Head and Head Code are required!",
      });
      return;
    }
    // Prepare the payload
    const payload: any = {
      head: this.selected_acc_head.head,
      head_code: this.selected_acc_head.head_code,
      short_desc: this.selected_acc_head.short_description || "",
      flag: this.isEditing ? "E" : "A",  // 'E' for Edit, 'A' for Add
    };
    if (this.isEditing && this.selected_acc_head.head_id) {
      payload.head_id = this.selected_acc_head.head_id;  // Include only in Edit mode
    }
    console.log("Saving Account Head:", payload);
    // Call API
    this.svr.fin_postservice('api/v0/save_head', payload).subscribe(
      (res: any) => {
        console.log("Save Response:", res);
        alert("Account Head saved successfully!");
        Swal.fire({
          icon: 'success',
          title: 'Saved',
          // text: `New head code: ${res}`,
          timer: 2000,
          showConfirmButton: true,
          });
        // Refresh the table
        this.fetch_heads();
        // Reset form after saving
        this.init();
      },
      (error) => {
        console.error("Error saving Account Head:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error saving Account Head',
        });
      }
    );
  }


  editSubject() {
    this.isEditing = false;
    this.isReadOnly = false;
    this.isAdding = false;
  }

  addNew() {
    this.isEditing = false;
    window.location.reload();
    this.init();
  }

  rowActive(row: any, index: number) {
    this.activeRowIndex = index;
    this.selected_acc_head = {
      parent_head: row.vch_head, // Map to vch_secondary_head
      head_code: row.vch_head_code, // Map to vch_secondary_code
      head: row.vch_secondary_head, // Map to vch_primary_head
      short_description: row.vch_short_desc, // No equivalent, set as empty
      primary: row.vch_primary_head, // Map to int_primary_id
      type: row.vch_type, // Map to vch_type
    };
    console.log('Selected Data:', this.selected_acc_head);
    this.isEditing = true;
    this.isReadOnly = true;
    // Highlight the selected row
    this.rowColors = this.rowColors.map(() => '');
    this.rowColors[index] = '#ff0000';
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
    this.svr.fin_postservice('api/v0/get_heads').subscribe((res: any) => {
      this.head_list = res;
      this.dataSource = new MatTableDataSource(this.head_list);
      this.dataSource.paginator = this.paginator;
      console.log('Loaded from API');
    });
  }

  // for filter while search
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
