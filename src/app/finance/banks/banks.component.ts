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
  hasDeactivatedRows: any;
  selected_bank: any = {}; // **Unified object**
  errors: any = {}; // Stores validation messages
  statesWithDistricts: any[] = [];
  districts: any[] = [];
  selectedState: string = '';
  selectedStateId: number | null = null;

  data_list: any;

  constructor(private dialog: MatDialog, private svr: ServiceService) {}

  ngOnInit(): void {
    this.init();
    this.fetch_records();
    this.addNew();
    this.fetch_states();
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
  }

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
          // this.isEditing = true;
          // this.isReadOnly = true;
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

  rowActive(row: any, index: number) {
    this.activeRowIndex = index;
    const bank_id = row.int_bank_id; // Extract the bank ID
    // Call API to fetch bank details using the extracted bank ID
    this.fetch_bank_details(bank_id);
    this.selected_bank = {
      unit: { id: row.id, code: row.code, unit: row.int_unit_id },
      bank_type: {
        secondary_code: row.vch_parent_head_code,
        secondary_head: row.vch_parent_head_code,
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
        this.selected_bank = {
          ...this.selected_bank, // Preserve existing values
          unit: this.selected_bank?.unit || {},
          bank_type: this.selected_bank?.bank_type || {},
          acc_head: this.selected_bank?.acc_head || {},
          bank_id: { bank_id: bank_id },
          details: {
            bank_code: res.bank_code ?? '', // Ensure code is included
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
          },
        };
        this.hasDeactivatedRows = res.tny_listing !== 1; // Check if listing is not 1
        console.log('Selected Bank Details:', this.selected_bank);
      },
      (error) => {
        console.error('Error fetching bank details:', error);
        this.showNotification('error', 'Error', 'Failed to load bank details');
      }
    );
  }

  fetch_states() {
    this.svr.fin_getService('api/v0/get_states', {}).subscribe((res: any) => {
      this.statesWithDistricts = res.filter((state: any) => state.active === 1);
    });
  }

  fetch_districts(stateId: number) {
    this.svr
      .fin_getService('api/v0/get_districts', { state_id: stateId })
      .subscribe((res: any) => {
        this.districts = res.filter((district: any) => district.active === 1);
        // Now districts array contains objects with both id and district properties
      });
  }

  onStateChange(event: any) {
    const selectedName = event.target.value;
    const found = this.statesWithDistricts.find(
      (s) => s.state === selectedName
    );

    if (found) {
      this.selectedStateId = found.id;
      this.selected_bank.details.state = selectedName;
      this.selected_bank.details.state_id = found.id;
      this.fetch_districts(found.id);
    } else {
      this.districts = [];
      this.selected_bank.details.state = '';
      this.selected_bank.details.state_id = null;
    }
  }

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
    // // Ensure it's at least 4 digits long by padding with zeros
    // if (userInput.length < 4) {
    //   inputElement.value = userInput.padStart(4, '0');
    // this.selected_bank.acc_head.head_code = inputElement.value; // **Update the model**
    // }
  }
  onDeactivateToggle(event: any): void {
    // If checked, deactivate (set listing = 0)
    // If unchecked, activate (set listing = 1)
    this.selected_bank.details.listing = event.target.checked ? 0 : 1;
    // console.log('Listin:', this.selected_bank.details.listing);
  }

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
    // let payload = {
    //   ...this.selected_bank,
    //   // bank_id: {
    //   //   bank_id: this.isEditing ? this.selected_bank.bank_id.bank_id : '' },
    // };
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
      unit_id: this.selected_bank.unit?.code || '',
      secondary_head_id: this.selected_bank.bank_type?.secondary_id || '',
      bank_code: this.selected_bank.details?.bank_code || '',
      head_id: this.selected_bank.acc_head?.head_code || '',
      head_code: this.selected_bank.acc_head?.head_id || '',
      listing: this.selected_bank.details?.listing,

      bank: this.selected_bank.details?.bank_name || '',
      short_desc: this.selected_bank.details?.short_name || '',
      acc_no: this.selected_bank.details?.account_no || '',
      ifsc: this.selected_bank.details?.ifsc || '',
      branch: this.selected_bank.details?.branch || 'Kazhakkoottam',
      // passbook_ob: this.selected_bank.details?.passbook_ob || "",
      // address_id: this.selected_bank.details?.address_id || "",
      building: this.selected_bank.details?.building || '',
      street: this.selected_bank.details?.street_name || '',
      place: this.selected_bank.details?.place || '',
      main_place: this.selected_bank.details?.main_place || '',
      // state_id: this.selected_bank.details?.state_id || "",
      // state: this.selected_bank.details?.state || "", // If available
      // dist_id: this.selected_bank.details?.dist_id || "",
      post: this.selected_bank.details?.post || '',
      pin: this.selected_bank.details?.pin || '',
      mobile: this.selected_bank.details?.mobile || '',
      email: this.selected_bank.details?.email || '',

      // State and District from the selected values
      district: this.selected_bank.details.district || '',
      dist_id: selectedDistrictObj?.id || '',
      state_id: this.selected_bank.details.state_id || '',
      state: this.selected_bank.details.state || '',

      group_id: 8, // Static value, change if needed
      address_id: '1',
      passbook_ob: '',
    };
    console.log('Payload to save:', payload);
    // console.log(JSON.stringify(payload))

    // if (payload) return;

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
    // Force change detection
    this.errors = { ...this.errors };

    return Object.keys(this.errors).length === 0; // Return true if no errors
  }
  // Helper Functions for Validation
  isValidEmail(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }
  isValidMobile(mobile: string): boolean {
    return /^[0-9]{10}$/.test(mobile); // 10-digit mobile number validation
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
