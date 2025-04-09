import { Component, ViewChild } from '@angular/core';
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
  isEditing: boolean = false; // Editing flag
  isAdding: boolean = false; // Adding flag
  isReadOnly: boolean = true; // Controls form field interactivity
  isEnabled: boolean = false; // Controls button interactivity
  activeRowIndex: number | null = null; // Index of the active row
  rowColors: string[] = [];
  hasDeactivatedRows: any; // Flag to check if any row is deactivated
  selected_bank: any = {}; // **Unified object**
  errors: any = {}; // Stores validation messages
  statesWithDistricts: any[] = [];
  districts: any[] = [];
  selectedState: string = '';
  selectedStateId: number | null = null;

  constructor(private dialog: MatDialog, private svr: ServiceService) {}

  ngOnInit(): void {
    this.init();
    this.fetch_records();
    this.addNew();
    this.fetch_states();
  }

  // Fetch records from the server and populate the data source for the table
  fetch_records() {
    let param = {
      unit_id: 1,
    };
    // Check if data is available in cache
    this.svr.fin_getService('api/v0/get_bank_list', param).subscribe(
      (res: any) => {
        const data_list = res;
        this.dataSource = new MatTableDataSource(data_list);
        this.dataSource.paginator = this.paginator;
        // Check if any row is deactivated (tny_flag === 2)
        this.hasDeactivatedRows = res.some((row: any) => row.tny_flag === 2);
      },
      (error) => {
        console.error('Error saving Account Head:', error);
        this.showNotification('error', 'Error', 'Error fetching Table');
      }
    );
  }

  // Initialize the form and reset values
  init() {
    this.errors = {}; // Reset previous errors
    this.isReadOnly = false;
    this.isAdding = true;
    this.isEditing = false;
    this.selected_bank = {
      unit: { id: '', code: '', unit: '' },
      bank_id: { bank_id: '' },
      bank_type: { secondary_id: '', secondary_code: '', secondary_head: '' },
      acc_head: { head_code: '', head_id: '' },
      details: {
        bank_code: '',
        bank_name: '',
        short_name: '',
        ifsc: '',
        account_no: '',
        branch: '',
        email: '',
        mobile: '',
        building: '',
        street_name: '',
        place: '',
        main_place: '',
        district: '',
        post: '',
        pin: '',
        state: '',
        state_id: null,
        dist_id: null,
        passbook_ob: 0,
        address_id: null,
        listing: 1,
      },
    };
  }

  addNew() {
    this.init();
    this.isEditing = false;
    this.isAdding = true;
    this.isReadOnly = false;
    this.isEnabled = true;
  }

  // Open the search dialog for selecting a unit
  open_unit() {
    if (this.isAdding) {
      const dialogRef = this.dialog.open(SearchOfficeComponent, {
        width: '1130px',
      });
      dialogRef?.afterClosed().subscribe((response: any) => {
        if (response && response.data) {
        }
        const userData = response.data;
        this.selected_bank = {
          ...this.selected_bank, // Preserve existing values
          unit: {
            id: userData.id,
            code: userData.code,
            unit: userData.unit,
          },
        };
        // console.log('Unit Selected', this.selected_bank);
      });
    }
  }

  callOpenBankType() {
    if (this.isAdding) {
      // Ensure unit is selected properly
      if (
        !this.selected_bank.unit ||
        !this.selected_bank.unit.id ||
        !this.selected_bank.unit.code?.toString().trim()
      ) {
        this.showNotification('info', 'Info', 'Select Unit First');
        return;
      }
      // console.log('Selected Unit', this.selected_unit);
      this.open_bank_type();
    }
  }

  // Open the search dialog for selecting a bank type
  open_bank_type() {
    if (this.isAdding) {
      const dialogRef = this.dialog.open(SearchSecondaryHeadsComponent, {
        width: '1130px',
        data: { source: 'bankHead' },
      });
      dialogRef?.afterClosed().subscribe((response: any) => {
        if (response && response.data) {
          const userData = response.data;
          this.selected_bank = {
            ...this.selected_bank, // Preserve existing values
            bank_type: {
              secondary_id: userData.int_secondary_id,
              secondary_code: userData.vch_secondary_code,
              secondary_head: userData.vch_secondary_head,
            },
          };
          // Only fetch heads if secondary_code is set
          if (this.selected_bank.bank_type.secondary_code) {
            console.log(
              'Fetching heads for:',
              this.selected_bank.bank_type.secondary_code
            );
            // this.fetch_heads();
          }
          // console.log('Selected Acc Head:', this.selected_acc_head);
        }
      });
    }
  }

  callOpenAccountHeads() {
    if (this.isAdding) {
      // Ensure unit is selected properly
      if (
        !this.selected_bank.unit ||
        !this.selected_bank.unit.id ||
        !this.selected_bank.unit.code?.toString().trim()
      ) {
        this.showNotification('info', 'Info', 'Select Unit First');
        return;
      } else if (
        !this.selected_bank.bank_type ||
        !this.selected_bank.bank_type.secondary_head ||
        !this.selected_bank.bank_type.secondary_code?.toString().trim()
      ) {
        this.showNotification('info', 'Info', 'Select Bank Type');
        return;
      }
      // console.log('Selected Unit', this.selected_unit);
      this.open_account_head();
    }
  }

  // Open the search dialog for selecting an account head
  open_account_head() {
    if (this.isAdding) {
      const dialogRef = this.dialog.open(SearchAccountHeadsComponent, {
        width: '1130px',
        data: { filterParam: this.selected_bank?.bank_type.secondary_id },
      });
      dialogRef?.afterClosed().subscribe((response: any) => {
        if (response && response.data) {
          const userData = response.data;
          this.selected_bank = {
            ...this.selected_bank,
            acc_head: {
              head_code: userData.vch_head_code,
              head_id: userData.int_head_id,
            },
          };
          // console.log('Selected Row', this.selected_acc_head);
        }
      });
    }
  }

  // Select a row in the table and fetch bank details
  // This function is called when a row is clicked in the table
  rowActive(row: any, index: number) {
    this.activeRowIndex = index;
    const bank_id = row.int_bank_id; // Extract the bank ID
    // Call API to fetch bank details using the extracted bank ID
    this.fetch_bank_details(bank_id);
    this.selected_bank = {
      unit: { id: row.id, code: row.code, unit: row.int_unit_id },
      bank_type: {
        secondary_code: row.vch_secondary_head_code,
        secondary_head: row.int_secondary_head_id,
      },
      acc_head: { head_code: row.vch_head_code },
      bank_id: { bank_id: row.int_bank_id },
    };
    // Ensure details object exists before API response
    if (!this.selected_bank.details) {
      // console.log('Enterd into details intialisation');
      this.selected_bank.details = {
        bank_code: '',
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
        state_id: null,
        dist_id: null,
        passbook_ob: 0,
        address_id: null,
        listing: 1,
      };
    }
    // console.log('Selected Bank Details', this.bank_details);
    // Set the flags for editing
    this.isEditing = true;
    this.isReadOnly = true;
    this.isAdding = false;
    this.isEnabled = true;
    // Highlight the selected row
    this.rowColors = this.rowColors.map(() => '');
    this.rowColors[index] = '#ff0000';
  }

  fetch_bank_details(bank_id: number) {
    if (typeof bank_id !== 'number' || bank_id <= 0) {
      console.error('Invalid bank ID');
      return;
    }
    let param = { bank_id: bank_id };
    this.svr.fin_getService('api/v0/get_bank_details', param).subscribe(
      (res: any) => {
        // console.log('Bank Details:', res);
        // Update the existing object instead of creating a new one
        this.selected_bank.bank_id.bank_id = bank_id;
        // Populate bank_details from API response
        this.selected_bank.details = {
          // Preserve existing values
          bank_code: res.vch_bank_code ?? '', // Ensure code is included
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
          branch: res.vch_branch ?? '',
          passbook_ob: res.num_passbook_ob ?? 0,
          address_id: res.int_address_id ?? null,
          listing: res.tny_listing,
          state_id: res.int_state_id ?? null,
          dist_id: res.int_dist_id ?? null,
        };
        // Set state and district based on API response
        if (
          this.isEditing &&
          this.selected_bank.details.state_id &&
          this.districts.length === 0
        ) {
          this.fetch_districts(this.selected_bank.details.state_id);
        }

        this.hasDeactivatedRows = res.tny_listing !== 1; // Check if listing is not 1, for marking as deactivated
        console.log('Selected Bank Details:', this.selected_bank);
      },
      (error) => {
        console.error('Error fetching bank details:', error);
        this.showNotification('error', 'Error', 'Failed to load bank details');
      }
    );
  }

  // Fetch states from the server
  fetch_states() {
    this.svr.fin_getService('api/v0/get_states', {}).subscribe((res: any) => {
      this.statesWithDistricts = res.filter((state: any) => state.active === 1);

      // Now that states are loaded, bind state_id properly
      if (this.isEditing && this.selected_bank.details.state_id) {
        const state = this.statesWithDistricts.find(
          (s) => s.id === this.selected_bank.details.state_id
        );
        if (state) {
          this.selectedStateId = state.id;
          // ✅ Trigger districts load after state is set
          this.fetch_districts(state.id);
        }
      }
    });
  }

  // Fetch districts based on selected state
  fetch_districts(stateId: number) {
    this.svr
      .fin_getService('api/v0/get_districts', { state_id: stateId })
      .subscribe((res: any) => {
        this.districts = res.filter((district: any) => district.active === 1);

        // Set district only after districts are fetched
        if (this.isEditing && this.selected_bank.details.dist_id) {
          const district = this.districts.find(
            (d) => d.id === this.selected_bank.details.dist_id
          );
          if (district) {
            this.selected_bank.details.district = district.district;

            // Optional: re-assign dist_id to trigger change detection
            this.selected_bank.details.dist_id = district.id;
          } else {
            // Reset if not found
            this.selected_bank.details.dist_id = null;
          }
        }
      });
  }

  // Handle state change event
  onStateChange(event: any) {
    const selectedStateId = +event.target.value; // Ensure it's a number
    const state = this.statesWithDistricts.find(
      (s) => s.id === selectedStateId
    );

    if (state) {
      this.selectedStateId = selectedStateId;
      this.selected_bank.details.state = state.state;
      this.selected_bank.details.state_id = selectedStateId;
      this.fetch_districts(selectedStateId);
      // Clear district when state changes
      this.selected_bank.details.district = '';
      this.selected_bank.details.dist_id = null;
    } else {
      this.selectedStateId = null;
      this.selected_bank.details.state = '';
      this.selected_bank.details.state_id = null;
      this.districts = [];
    }
  }

  // Handle district change event
  onDistrictChange(event: any) {
    const selectedDistrictId = +event.target.value;
    // const district = this.districts.find((d) => d.id === selectedDistrictId);
    this.selected_bank.details.dist_id = selectedDistrictId;
  }

  // Handle input validation for Bank Code
  validateCode(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const userInput = inputElement.value.trim();
    // Check if input is a valid number
    if (!/^\d*$/.test(userInput)) {
      this.showNotification(
        'error',
        'Invalid Input',
        'Only numbers are allowed!'
      );
      inputElement.value = ''; // Clear the input field
      return;
    }
  }

  // Handle toggle for deactivation
  onDeactivateToggle(event: any): void {
    this.selected_bank.details.listing = event.target.checked ? 0 : 1;
  }

  // Handle save action
  save() {
    this.validateForm(); // Run validation only when Save is clicked
    if (Object.keys(this.errors).length > 0) {
      console.error('Form has validation errors:', this.errors);
      this.showNotification(
        'warning',
        'Warning',
        'Please fix the form errors before saving.'
      );
      return;
    }
    let payload: any = {};
    // Find the selected district object
    const selectedDistrictObj = this.districts.find(
      (d: any) => d.district === this.selected_bank.details.district
    );
    // Only add `bank_id` if `isEditing` is true and it has a value
    if (!this.isEditing && this.selected_bank.bank_id?.bank_id) {
      payload.bank_id = this.selected_bank.bank_id.bank_id;
    }
    payload = {
      ...payload, // Spread existing values
      unit_id: 1, // Need to integrate actual unit_id from the sessions
      secondary_id: this.selected_bank.bank_type?.secondary_id || '',
      secondary_code: this.selected_bank.bank_type?.secondary_code || '',
      bank_code: this.selected_bank.details?.bank_code || '',
      head_id: this.selected_bank.acc_head?.head_code || '',
      head_code: this.selected_bank.acc_head?.head_id || '',
      listing: this.selected_bank.details?.listing,

      bank: this.selected_bank.details?.bank_name || '',
      short_desc: this.selected_bank.details?.short_name || '',
      acc_no: this.selected_bank.details?.account_no || '',
      ifsc: this.selected_bank.details?.ifsc || '',
      branch: this.selected_bank.details?.branch || '',
      building: this.selected_bank.details?.building || '',
      street: this.selected_bank.details?.street_name || '',
      place: this.selected_bank.details?.place || '',
      main_place: this.selected_bank.details?.main_place || '',
      post: this.selected_bank.details?.post || '',
      pin: this.selected_bank.details?.pin || '',
      mobile: this.selected_bank.details?.mobile || '',
      email: this.selected_bank.details?.email || '',

      // State and District from the selected values
      state: this.selected_bank.details.state,
      state_id: this.selected_bank.details.state_id,
      district: this.selected_bank.details.district,
      dist_id: this.selected_bank.details.dist_id,

      group_id: 8, // Static value, change if needed
      address_id: '1',
      passbook_ob: '0.00',
    };
    console.log('Payload to save:', payload);
    // Call the save API
    this.svr.fin_postservice('api/v0/save_bank', payload).subscribe(
      (response) => {
        console.log('Save Response:', response);
        if (response && !response.error) {
          Swal.fire('Success', 'Bank details saved successfully!', 'success');
          this.addNew(); // Reset the form after saving
          this.fetch_records();
        } else {
          Swal.fire('Error', 'Failed to save bank details', 'error');
        }
      },
      (error) => {
        console.error('Error saving bank details:', error);
        Swal.fire('Error', 'Error saving bank details. Try again!', 'error');
      }
    );
  }

  //  Handle validation before save
  validateForm() {
    this.errors = {}; // Reset previous errors
    if (!this.selected_bank.details.bank_name?.trim()) {
      this.errors.bank_name = 'Bank Name is required.';
    }
    if (!this.selected_bank.details.short_name?.trim()) {
      this.errors.short_name = 'Short Name is required.';
    }
    if (!this.selected_bank.details.branch?.trim()) {
      this.errors.branch = 'Branch is required.';
    }
    // Validate IFSC Code
    if (!this.selected_bank.details.ifsc?.trim()) {
      this.errors.ifsc = 'IFSC Code is required.';
    } else if (!this.isValidIFSC(this.selected_bank.details.ifsc)) {
      this.errors.ifsc = 'Invalid IFSC Code format.';
    }
    // Validate Account Number
    if (!String(this.selected_bank.details.account_no)?.trim()) {
      this.errors.account_no = 'Account Number is required.';
    } else if (
      !this.isValidAccountNumber(this.selected_bank.details.account_no)
    ) {
      this.errors.account_no = 'Account Number must be between 9 to 18 digits.';
    }
    if (
      !this.selected_bank.details.email?.trim() ||
      !this.isValidEmail(this.selected_bank.details.email)
    ) {
      this.errors.email = 'Valid Email is required.';
    }
    if (
      !this.selected_bank.details.mobile?.trim() ||
      !this.isValidMobile(this.selected_bank.details.mobile)
    ) {
      this.errors.mobile = 'Valid Mobile Number is required.';
    }
    if (
      !this.selected_bank.details.pin?.trim() ||
      !this.isValidPin(this.selected_bank.details.pin)
    ) {
      this.errors.pin = 'Valid Pin Number is required.';
    }
    if (this.selected_bank.bank_code) {
      // // Ensure it's at least 4 digits long by padding with zeros
      //   inputElement.value = userInput.padStart(4, '0');
      // this.selected_bank.acc_head.head_code = inputElement.value; // **Update the model**
    }
    // Force change detection
    this.errors = { ...this.errors };

    return Object.keys(this.errors).length === 0; // Return true if no errors
  }
  // Helper Functions for Validation
  isValidEmail(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }
  isValidMobile(mobile: string): boolean {
    return /^[0-9]{10}$/.test(mobile); // Ensures the mobile number contains exactly 10 digits
  }
  isValidPin(pin: string): boolean {
    return /^[1-9][0-9]{5}$/.test(pin); // Corrected regex for Indian PIN codes
  }
  isValidIFSC(ifsc: string): boolean {
    const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return regex.test(ifsc);
  }
  isValidAccountNumber(accountNo: string): boolean {
    const regex = /^\d{9,18}$/;
    return regex.test(accountNo);
  }

  // Handle Edit functionality
  editSubject() {
    this.isEditing = false;
    this.isReadOnly = true;
    this.isAdding = false;
    this.isEnabled = false;
  }

  // for filter while search
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Helper function for Swal
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
