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
  selected_acc_head: any = {};
  head_list: any = [];
  isEditing: boolean = false;
  isAdding: boolean = false;
  isReadOnly: boolean = true; // Controls form field interactivity
  activeRowIndex: number | null = null;
  rowColors: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['code', 'head', 'primary_head'];
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
      primary_head: '',
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
            primary_id: userData.int_primary_id, // 1
            primary_code: userData.vch_primary_code ?? '', // Ensure safe assignment
            primary_head: userData.vch_primary_head, // Tax Revenue
            secondary_id: userData.int_secondary_id, // 1
            secondary_code: userData.vch_secondary_code, // 110010000
            secondary_head: userData.vch_secondary_head, // Property Tax (for General Purpose)
            tny_type: userData.tny_type, // 1 (Ensuring type is mapped correctly)
            system: userData.tny_system ?? null, // Mapping system field
            head_code: '',
            unit_id: null, // Keeping null as per the API response
            flag: 'A', // Since it's adding a new record

            secondary: userData.int_secondary_id, // Map to int_secondary_id
            type: userData.vch_type, // Map to int_secondary_id
          };
          // Fetch new head code
          this.getNewHeadCode(userData.int_secondary_id);
          // console.log('Selected Acc Head:', this.selected_acc_head);
          // this.isEditing = true;
          // this.isReadOnly = true;
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
      console.error('Head and Head Code are required!');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Head and Head Code are required!',
      });
      return;
    }
    // console.log("Selected ACC Head",this.selected_acc_head)
    // Prepare the payload
    const payload = {
      head_id: this.isEditing ? this.selected_acc_head.head_id : null, // Null if adding
      head: this.selected_acc_head.head, // Mapped from vch_secondary_head
      head_code: String(this.selected_acc_head.head_code), // Ensure it's a string
      type: this.selected_acc_head.tny_type, // Mapped from tny_type
      primary_id: this.selected_acc_head.primary_id, // Mapped from int_primary_id
      primary_code: this.selected_acc_head.primary_code, // Mapped from vch_primary_code
      primary_head: this.selected_acc_head.primary_head, // Mapped from vch_primary_head
      secondary_id: this.selected_acc_head.secondary_id, // Mapped from int_secondary_id
      secondary_code: this.selected_acc_head.secondary_code, // Mapped from vch_secondary_code
      secondary_head: this.selected_acc_head.secondary_head, // Mapped from vch_secondary_head
      system: this.selected_acc_head.system, // Mapped from tny_system
      unit_id: this.selected_acc_head.unit_id, // Mapped from int_unit_id
      short_desc: this.selected_acc_head.short_description ?? '', // Default empty string if null
      flag: this.isEditing ? 'E' : 'A', // "E" for edit, "A" for add
    };
    if (this.isEditing && this.selected_acc_head.head_id) {
      payload.head_id = this.selected_acc_head.head_id; // Include only in Edit mode
    }
    // console.log("Saving Account Head:", payload);
    // Call API
    this.svr.fin_postservice('api/v0/save_head', payload).subscribe(
      (res: any) => {
        // console.log("Save Response:", res);
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
        console.error('Error saving Account Head:', error);
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
      parent_head: row.vch_secondary_head, // Correct mapping from vch_secondary_head
      head: row.vch_secondary_head, // Correct mapping from vch_secondary_head
      head_code: row.vch_head_code, // Correct mapping from vch_head_code
      short_description: row.vch_short_desc ?? '', // Ensure it's always a string
      primary_id: row.int_primary_id, // Correct mapping from int_primary_id
      primary_code: row.vch_primary_code ?? '', // Ensure safe assignment
      primary_head: row.vch_primary_head, // Correct mapping from vch_primary_head
      secondary_id: row.int_secondary_id, // Correct mapping from int_secondary_id
      secondary_code: row.vch_secondary_code, // Correct mapping from vch_secondary_code
      secondary_head: row.vch_secondary_head, // Correct mapping from vch_secondary_head
      tny_type: row.tny_type, // Ensure type is mapped correctly
      system: row.tny_system ?? null, // Ensure safe assignment
      unit_id: row.int_unit_id ?? null, // Ensure safe assignment
      flag: 'E', // Since it's an edit action
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
      // console.log('Loaded from cache');
      return;
    }
    this.svr.fin_postservice('api/v0/get_heads').subscribe((res: any) => {
      this.head_list = res;
      this.dataSource = new MatTableDataSource(this.head_list);
      this.dataSource.paginator = this.paginator;
      // console.log('Loaded from API');
    });
  }

  // for filter while search
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
