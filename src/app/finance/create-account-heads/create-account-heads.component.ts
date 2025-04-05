import {
  ChangeDetectorRef,
  Component,
  ElementRef,
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

declare var bootstrap: any; // Ensure Bootstrap is accessible for modal handling

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
  isEnabled: boolean = false;
  activeRowIndex: number | null = null;
  rowColors: string[] = [];
  originalHeadCode: string = ''; // Store the fetched head code
  errorMessage: string = '';
  headCodeInvalid: boolean = false;
  hasDeactivatedRows: any;
  selectedExistingHead: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('headCodeInput', { static: false }) editModal!: ElementRef;
  headCodeInput!: ElementRef<HTMLInputElement>;

  displayedColumns: string[] = ['code', 'head', 'secondary', 'primary_head'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private dialog: MatDialog,
    private svr: ServiceService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Initialize paginator
    this.init();
    this.addNew();
    this.fetch_heads();
    this.resetHeadCodeValidation();
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
        data: { source: 'accountHead' },
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
            flag: 0, // Since it's adding a new record

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
          this.originalHeadCode = res; // Store the original head code
          // console.log('Fetched Original Head Code:', this.originalHeadCode);
          // Reset validation states
          this.resetHeadCodeValidation();
        }
      },
      (error) => {
        // console.error('Error fetching head code:', error);
        // Display error message
        this.showNotification(
          'error',
          'Error',
          'Failed to fetch head code. Please try again.'
        );
      }
    );
  }

  validateHeadCode(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const userInput = inputElement.value.trim();
    this.headCodeInvalid = false; // Reset validation state
    this.errorMessage = '';
    // Ensure originalHeadCode is treated as a string and trimmed
    const originalHeadCode = this.originalHeadCode
      ? String(this.originalHeadCode).trim()
      : '';
    // console.log('Original:', originalHeadCode, '| Entered:', userInput);
    // Case 1: Empty input → Error
    if (!userInput) {
      this.headCodeInvalid = true;
      this.errorMessage = 'Head Code is required.';
      return;
    }
    // Case 2: Unchanged → Valid
    if (userInput === originalHeadCode) {
      // console.log('✅ Head Code matches original.');
      return;
    }
    // Case 3: Modified → Strict checks
    // Check 1: Must be a 9-digit number
    if (!/^\d{9}$/.test(userInput)) {
      this.headCodeInvalid = true;
      this.errorMessage = 'Head Code must be a 9-digit number.';
      return;
    }
    // Check 2: First 5 digits must match original
    if (
      originalHeadCode.length >= 5 &&
      userInput.substring(0, 5) !== originalHeadCode.substring(0, 5)
    ) {
      this.headCodeInvalid = true;
      this.errorMessage = 'First 5 digits must match the original Head Code.';
      return;
    }
    // Check 3: Only last 4 digits can differ
    if (
      originalHeadCode.length === 9 &&
      userInput.substring(0, 5) !== originalHeadCode.substring(0, 5)
    ) {
      this.headCodeInvalid = true;
      this.errorMessage = 'Only the last 4 digits can be modified.';
      return;
    }
    // Case 4: Check if Head Code already exists in head_list
    // const headExists = this.head_list.find(
    //   (head: any) => head.vch_head_code === userInput
    // );
    // // if (headExists) {
    // //   this.headExists(headExists);
    // //   return;
    // // }
    // If all checks pass
    // console.log('⚠️ Head Code modified, but valid.');
    inputElement.classList.remove('is-invalid');
  }

  onHeadCodeBlur(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const userInput = inputElement.value.trim();
    this.headCodeInvalid = false;
    this.errorMessage = '';

    if (!userInput) {
      this.headCodeInvalid = true;
      this.errorMessage = 'Head Code is required.';
      return;
    }
    if (!/^\d{9}$/.test(userInput)) {
      this.headCodeInvalid = true;
      this.errorMessage = 'Head Code must be a 9-digit number.';
      return;
    }

    const existingHead = this.head_list.find(
      (head: any) => head.vch_head_code === userInput
    );
    if (existingHead && this.isAdding) {
      this.selectedExistingHead = existingHead;
      this.headCodeInvalid = true;
      Swal.fire({
        icon: 'info',
        title: 'This Head Code already exists.',
        text: 'Do you want to edit it?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmEdit(); // Your edit function
        } else {
          // Optional: do nothing or show another message
        }
      });
    }
  }

  confirmEdit(): void {
    if (this.selectedExistingHead) {
      this.rowActive(
        this.selectedExistingHead,
        this.head_list.indexOf(this.selectedExistingHead)
      );
      this.headCodeInvalid = false;
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): boolean {
    return /[0-9]/.test(event.key);
  }

  save() {
    if (!this.validateSave()) {
      return;
    }
    // console.log("Selected head id",this.selected_acc_head.id)
    // console.log("Selected ACC Head",this.selected_acc_head)
    // Prepare the payload
    const payload = {
      head_id: this.selected_acc_head.id ? this.selected_acc_head.id : null, // Null if adding
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
      flag: this.selected_acc_head.deactivate ? 2 : 0,
    };
    console.log('Saving Account Head:', payload);
    // Call API
    this.svr.fin_postservice('api/v0/save_head', payload).subscribe(
      (res: any) => {
        // console.log("Save Response:", res);
        this.showNotification('success', 'Saved', undefined, 2000);
        // Refresh the table
        this.fetch_heads();
        setTimeout(() => this.cdRef.detectChanges(), 100);
        // Reset form after saving
        this.init();
      },
      (error) => {
        console.error('Error saving Account Head:', error);
        this.showNotification('error', 'Error', 'Error saving Account Head');
      }
    );
  }

  validateSave(): boolean {
    if (!this.selected_acc_head.head || !this.selected_acc_head.head_code) {
      this.showNotification(
        'error',
        'Error',
        'Head and Head Code are Required!'
      );
      return false;
    } else if (!this.selected_acc_head.parent_head) {
      this.showNotification('error', 'Error', 'Parent Head Not Present!');
      return false;
    } else if (
      !this.selected_acc_head.secondary_id ||
      !this.selected_acc_head.secondary_code ||
      !this.selected_acc_head.secondary_head
    ) {
      this.showNotification(
        'error',
        'Error',
        'Secondary id, code and head details are Required'
      );
      return false;
    } else if (
      !this.selected_acc_head.short_description ||
      this.selected_acc_head.short_description.trim() === ''
    ) {
      this.showNotification(
        'error',
        'Error',
        'Short Description cannot be empty!'
      );
      return false;
    } else if (this.selected_acc_head.short_description.length < 3) {
      this.showNotification(
        'error',
        'Error',
        'Too short description! Minimum 3 characters required.'
      );
      return false;
    } else if (this.selected_acc_head.short_description.length > 25) {
      this.showNotification(
        'error',
        'Error',
        'Description too long! Maximum 25 characters allowed.'
      );
      return false;
    } else return true;
  }

  editSubject() {
    this.isEditing = false;
    this.isReadOnly = true;
    this.isAdding = false;
    this.isEnabled = false;
  }

  addNew() {
    this.isEditing = false;
    this.isAdding = true;
    this.isReadOnly = false;
    this.isEnabled = true;
    this.init();
  }

  rowActive(row: any, index: number) {
    this.activeRowIndex = index;
    this.selected_acc_head = {
      id: row.int_head_id, //!Important Head ID
      parent_head: row.vch_secondary_head, // Correct mapping from vch_head_code
      head: row.vch_head, // Correct mapping from vch_head
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
      tny_flag: row.tny_flag ?? 0, // Default to 0 if null
      deactivate: row.tny_flag === 2, // Set checkbox state
    };
    console.log('Selected Row', this.selected_acc_head);
    // Store the original head code for validation
    this.originalHeadCode = row.vch_head_code;
    // Reset validation states
    this.resetHeadCodeValidation();
    // console.log('Selected Data:', this.selected_acc_head);
    this.isEditing = true;
    this.isReadOnly = true;
    this.isAdding = false;
    this.isEnabled = true;
    // Highlight the selected row
    this.rowColors = this.rowColors.map(() => '');
    this.rowColors[index] = '#ff0000';
  }

  // Fetch data from API
  fetch_heads() {
    let param = {
      filter: 'all',
      id: 1,
    };
    // Check if data is available in cache
    this.svr.fin_postservice('api/v0/get_heads', param).subscribe(
      (res: any) => {
        this.head_list = res;
        this.dataSource = new MatTableDataSource(this.head_list);
        this.dataSource.paginator = this.paginator;
        // Check if any row is deactivated (tny_flag === 2)
        this.hasDeactivatedRows = res.some((row: any) => row.tny_flag === 2);
      },
      (error) => {
        console.error('Error saving Account Head:', error);
        this.showNotification('error', 'Error', 'Error fetching Table');
      }
    );
    // console.error('Error fetching head code:', error);
    // Display error message

    // console.log('Loaded from API');
  }

  // for filter while search
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetHeadCodeValidation(): void {
    this.headCodeInvalid = false;
    this.errorMessage = '';
    if (this.headCodeInput) {
      this.headCodeInput.nativeElement.classList.remove('is-invalid');
    }
  }

  showNotification(
    icon: 'success' | 'error' | 'warning' | 'info' | 'question',
    title: string,
    text?: string,
    timer?: number,
    showConfirmButton: boolean = true
  ) {
    return Swal.fire({
      icon,
      title,
      text,
      timer,
      showConfirmButton,
    });
  }
}
