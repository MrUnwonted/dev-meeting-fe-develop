import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SearchOfficeComponent } from '../modals/search-office/search-office.component';
import { MatDialog } from '@angular/material/dialog';
import { SearchSecondaryHeadsComponent } from '../modals/search-secondary-heads/search-secondary-heads.component';
import Swal from 'sweetalert2';
import { ServiceService } from 'src/app/services/service.service';
import { SearchAccountHeadsComponent } from '../modals/search-account-heads/search-account-heads.component';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.scss',
})
export class BanksComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'bank',
    'accountno',
    'code',
    'short_description',
    'head',
  ];
  dataSource = new MatTableDataSource<any>();
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
  selected_bank: any = {};
  selected_bank_type: any = {};
  selected_unit: any = {};
  head_list: any = [];
  selected_acc_head: any = {};
  bank_details: any = {};

  data_list: any;

  constructor(
    private dialog: MatDialog,
    private svr: ServiceService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.init();
    this.fetch_records();
    this.addNew();
  }

  fetch_records() {
    let param = {
      unit_id: 1,
    };
    // Check if data is available in cache
    this.svr.fin_getService('api/v0/get_bank_list', param).subscribe(
      (res: any) => {
        this.data_list = res;
        this.dataSource = new MatTableDataSource(this.data_list);
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

  init() {
    this.isReadOnly = false;
    this.isAdding = true;
    this.isEditing = false;
    this.selected_bank = {
      parent_head: '',
      head: '',
      primary_id: '',
      primary_code: '',
      primary_head: '',
      secondary_id: '',
      secondary_code: '',
      secondary_head: '',
      tny_type: '',
      system: '',
      head_code: '',
      unit_id: '',
      flag: '',
      secondary: '',
      type: '',
    };
    this.selected_unit = {
      id: '',
      code: '',
      unit: ' ',
    };
    this.bank_details = {
      bank_name: '',
      short_name: '',
      ifsc: '',
      account_no: '',
      email: '',
      mobile: '',
      building: '',
      street_name: '',
      place: '',
      main_place: '',
      district: '',
      post: '',
      pin: '',
    };
    this.selected_acc_head = {
      id: '',
      parent_head: '',
      head: '',
      head_code: '',
      short_description: '',
      primary_id: '',
      primary_code: '',
      primary_head: '',
      secondary_id: '',
      secondary_code: '',
      secondary_head: '',
    };
  }

  addNew() {
    this.isEditing = false;
    this.isAdding = true;
    this.isReadOnly = false;
    this.isEnabled = true;
    this.init();
  }

  open_unit() {
    if (this.isAdding) {
      const dialogRef = this.dialog.open(SearchOfficeComponent, {
        width: '1130px',
      });
      dialogRef?.afterClosed().subscribe((response: any) => {
        if (response && response.data) {
        }
        const userData = response.data;
        this.selected_unit = {
          id: userData.id, // Map
          code: userData.code, // Map
          unit: userData.unit, // Map
        };
      });
    }
  }

  callOpenBankType() {
    // Ensure unit is selected properly
    if (
      !this.selected_unit ||
      !this.selected_unit.id ||
      !this.selected_unit.code?.toString().trim()
    ) {
      this.showNotification('info', 'Info', 'Select Unit First');
      return;
    }
    // console.log('Selected Unit', this.selected_unit);
    this.open_bank_type();
  }

  open_bank_type() {
    if (this.isAdding) {
      const dialogRef = this.dialog.open(SearchSecondaryHeadsComponent, {
        width: '1130px',
      });
      dialogRef?.afterClosed().subscribe((response: any) => {
        if (response && response.data) {
          const userData = response.data;
          this.selected_bank_type = {
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
          // Only fetch heads if secondary_code is set
          if (this.selected_bank_type.secondary_code) {
            console.log(
              'Fetching heads for:',
              this.selected_bank_type.secondary_code
            );
            // this.fetch_heads();
          }
          // console.log('Selected Acc Head:', this.selected_acc_head);
          // this.isEditing = true;
          // this.isReadOnly = true;
        }
      });
    }
  }
  callOpenAccountHeads() {
    // Ensure unit is selected properly
    if (
      !this.selected_unit ||
      !this.selected_unit.id ||
      !this.selected_unit.code?.toString().trim()
    ) {
      this.showNotification('info', 'Info', 'Select Unit First');
      return;
    } else if (
      !this.selected_bank_type ||
      !this.selected_bank_type.secondary_head ||
      !this.selected_bank_type.secondary_code?.toString().trim()
    ) {
      this.showNotification('info', 'Info', 'Select Bank Type');
      return;
    }
    // console.log('Selected Unit', this.selected_unit);
    this.open_account_head();
  }

  open_account_head() {
    if (this.isAdding) {
      const dialogRef = this.dialog.open(SearchAccountHeadsComponent, {
        width: '1130px',
        data: { filterParam: this.selected_bank_type.secondary_id },
      });
      dialogRef?.afterClosed().subscribe((response: any) => {
        if (response && response.data) {
          const userData = response.data;
          this.selected_acc_head = {
            id: userData.int_head_id, //!Important Head ID
            parent_head: userData.vch_secondary_head, // Correct mapping from vch_head_code
            head: userData.vch_head, // Correct mapping from vch_head
            head_code: userData.vch_head_code, // Correct mapping from vch_head_code
            short_description: userData.vch_short_desc ?? '', // Ensure it's always a string
            primary_id: userData.int_primary_id, // Correct mapping from int_primary_id
            primary_code: userData.vch_primary_code ?? '', // Ensure safe assignment
            primary_head: userData.vch_primary_head, // Correct mapping from vch_primary_head
            secondary_id: userData.int_secondary_id, // Correct mapping from int_secondary_id
            secondary_code: userData.vch_secondary_code, // Correct mapping from vch_secondary_code
            secondary_head: userData.vch_secondary_head, // Correct mapping from vch_secondary_head
          };
          // console.log('Selected Row', this.selected_acc_head);
        }
      });
    }
  }

  rowActive(row: any, index: number) {
    this.activeRowIndex = index;
    const bank_id = row.int_bank_id; // Extract the bank ID
    // Call API to fetch bank details using the extracted bank ID
    this.fetch_bank_details(bank_id);
    // Binding account head details
    this.selected_acc_head = {
      id: row.int_head_id, //!Important Head ID
      parent_head: row.vch_bank_code, // Assuming this maps correctly
      head: row.vch_bank, // Bank Name
      head_code: row.vch_head_code, // Head Code
      short_description: row.vch_short_desc ?? '', // Short Name
      primary_id: '', // No direct mapping in API response
      primary_code: '', // No direct mapping in API response
      primary_head: '', // No direct mapping in API response
      secondary_id: '', // No direct mapping in API response
      secondary_code: '', // No direct mapping in API response
      secondary_head: '', // No direct mapping in API response
      tny_type: '', // No direct mapping in API response
      system: '', // No direct mapping in API response
      unit_id: row.int_unit_id ?? null, // Unit ID
      flag: 'E', // Since it's an edit action
      type: '', // No direct mapping in API response
      tny_flag: row.tny_listing ?? 0, // Default to 0 if null
      deactivate: row.tny_listing === 2, // Set checkbox state
    };

    console.log('Selected Row', this.selected_acc_head);
    // console.log('Selected Bank Details', this.bank_details);
    // Reset validation states
    // console.log('Selected Data:', this.selected_acc_head);
    this.isEditing = true;
    this.isReadOnly = true;
    this.isAdding = false;
    this.isEnabled = true;
    // Highlight the selected row
    this.rowColors = this.rowColors.map(() => '');
    this.rowColors[index] = '#ff0000';
  }

  fetch_bank_details(bank_id: number) {
    if (!bank_id) {
      console.error('Invalid bank ID');
      return;
    }

    let param = { bank_id: bank_id };

    this.svr.fin_getService('api/v0/get_bank_details', param).subscribe(
      (res: any) => {
        console.log('Bank Details:', res);

        // Populate bank_details from API response
        this.bank_details = {
          bank_name: res.vch_bank ?? '', // Bank Name
          short_name: res.vch_short_desc ?? '', // Short Name
          ifsc: res.vch_ifsc ?? '', // IFSC Code
          account_no: res.vch_acc_no ?? '', // Account Number
          email: res.vch_email ?? '', // Email
          mobile: res.vch_mobile ?? '', // Mobile
          building: res.vch_building ?? '', // Building
          street_name: res.vch_street ?? '', // Street Name
          place: res.vch_place ?? '', // Place
          main_place: res.vch_main_place ?? '', // Main Place
          district: res.vch_district ?? '', // District
          post: res.vch_post ?? '', // Post
          pin: res.vch_pin ?? '', // PIN Code
        };

        console.log('Updated Bank Details:', this.bank_details);
      },
      (error) => {
        console.error('Error fetching bank details:', error);
        this.showNotification('error', 'Error', 'Failed to load bank details');
      }
    );
  }


  save() {}

  editSubject() {}

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
