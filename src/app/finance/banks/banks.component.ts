import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SearchOfficeComponent } from '../modals/search-office/search-office.component';
import { MatDialog } from '@angular/material/dialog';
import { SearchSecondaryHeadsComponent } from '../modals/search-secondary-heads/search-secondary-heads.component';
import Swal from 'sweetalert2';
import { ServiceService } from 'src/app/services/service.service';
import { SearchAccountHeadsComponent } from '../modals/search-account-heads/search-account-heads.component';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.scss',
})
export class BanksComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('unitInput') unitInput!: ElementRef;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChild('bankNameInput') bankNameInput!: ElementRef;
  @ViewChild('input') searchInput!: ElementRef;

  displayedColumns: string[] = [
    'bank',
    'accountno',
    'code',
    'short_description',
    'head',
    'unit',
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
  bankTypeDisplay: string = ''; // Temporary display variable
  accountHeadDisplay: string = ''; // Temporary display variable
  editingRow: any = null; // Row being edited

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
      unit_id: '',
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
        console.error('Error fetching Table:', error);
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
    this.bankTypeDisplay = ''; // Reset display variable
    this.accountHeadDisplay = ''; // Reset display variable
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
        address_id: 1,
        listing: 1,
      },
    };
    // Scroll to the Unit input field
    setTimeout(() => {
      this.unitInput?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 0; // Info tab
    }
  }

  addNew() {
    this.init();
    this.isEditing = false;
    this.isAdding = true;
    this.isReadOnly = false;
    this.isEnabled = true;
    this.editingRow = null;
  }

  // Open the search dialog for selecting a unit
  open_unit() {
    // if (this.isAdding) {
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
      // console.log('Unit Selected', this.selected_bank.unit);
    });
    // }
  }

  callOpenBankType() {
    // if (this.isAdding) {
    // Ensure unit is selected properly
    if (!this.selected_bank.unit.unit && !this.selected_bank.unit.id) {
      // console.log('Selected Unit', this.selected_bank.unit);
      this.showNotification('info', 'Info', 'Select Unit First');
      return;
    }
    // console.log('Selected Unit', this.selected_unit);
    this.open_bank_type();

    // }
  }

  // Open the search dialog for selecting a bank type
  open_bank_type() {
    // if (this.isAdding) {
    const dialogRef = this.dialog.open(SearchSecondaryHeadsComponent, {
      width: '1130px',
      data: { source: 'bankHead' },
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (!response || !response.data) {
        console.log('Dialog was canceled, no changes applied.');
        return; // Do nothing if dialog was canceled
      }
      const userData = response.data;
      const newSecondaryId = userData.int_secondary_id;
      // Compare with current value
      const currentSecondaryId = this.selected_bank?.bank_type?.secondary_id;
      const bankTypeChanged = newSecondaryId !== currentSecondaryId;
      this.selected_bank = {
        ...this.selected_bank, // Preserve existing values
        bank_type: {
          secondary_id: userData.int_secondary_id,
          secondary_code: userData.vch_secondary_code,
          secondary_head: userData.vch_secondary_head,
        },
      };
      // Reset acc_head only if bank type changed
      if (bankTypeChanged) {
        this.selected_bank.acc_head = {
          head_code: '',
          head_id: '',
        };
        this.bankTypeDisplay = ''; // Reset display variable
        this.accountHeadDisplay = ''; // Reset display variable
      }
      // Set the combined display value
      this.bankTypeDisplay = `${userData.vch_secondary_code}-${userData.vch_secondary_head}`;
      // Only fetch heads if secondary_code is set
      if (this.selected_bank.bank_type.secondary_code) {
        console.log(
          'Fetching heads for:',
          this.selected_bank.bank_type.secondary_code
        );
        // this.fetch_heads();
      }
      // console.log('Selected Acc Head:', this.selected_bank.bank_type);
    });
    // }
  }

  callOpenAccountHeads() {
    // if (this.isAdding) {
    // Ensure unit is selected properly
    if (!this.selected_bank.unit.unit && !this.selected_bank.unit.id) {
      this.showNotification('info', 'Info', 'Select Unit First');
      return;
    } else if (!this.selected_bank.bank_type.secondary_id) {
      this.showNotification('info', 'Info', 'Select Bank Type');
      return;
    }
    // console.log('Selected Unit', this.selected_unit);
    this.open_account_head();
    // }
  }

  // Open the search dialog for selecting an account head
  open_account_head() {
    // if (this.isAdding) {
    const dialogRef = this.dialog.open(SearchAccountHeadsComponent, {
      width: '1130px',
      data: { filterParam: this.selected_bank?.bank_type.secondary_id },
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (!response || !response.data) {
        console.log('Account head dialog canceled. No changes applied.');
        return; // Do nothing if dialog was canceled
      }
      const userData = response.data;
      this.selected_bank = {
        ...this.selected_bank,
        acc_head: {
          head_code: userData.vch_head_code,
          head_id: userData.int_head_id,
          head: userData.vch_head,
        },
      };
      // Set the combined display value
      this.accountHeadDisplay = `${userData.vch_head_code}-${userData.vch_head}`;
      console.log('Selected Row', this.selected_bank.acc_head);
      console.log('Account Head Display', this.accountHeadDisplay);
    });
    // }
  }

  // Select a row in the table and fetch bank details
  // This function is called when a row is clicked in the table
  rowActive(row: any, index: number) {
    this.activeRowIndex = index;
    this.editingRow = row; // Store the row being edited
    const bank_id = row.int_bank_id; // Extract the bank ID
    // Call API to fetch bank details using the extracted bank ID
    this.fetch_bank_details(bank_id);
    this.selected_bank = {
      // unit: row.vch_unit
      unit: { id: row.int_unit_id, code: row.code },
      bank_type: {
        secondary_code: row.vch_secondary_head_code,
        secondary_id: row.int_secondary_head_id,
      },
      acc_head: { head_code: row.vch_head_code, head_id: row.int_head_id },
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
    this.errors = {}; // Reset errors on row selection
    // Scroll to the Unit input field
    setTimeout(() => {
      this.unitInput?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 0; // Info tab
    }
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
        this.selected_bank.unit.unit = res.vch_unit;
        // Set the combined display value
        this.bankTypeDisplay = `${this.selected_bank.bank_type.secondary_code}-${res.vch_parent_head}`;
        this.accountHeadDisplay = `${this.selected_bank.acc_head.head_code}-${res.vch_head}`;
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
          // Trigger districts load after state is set
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
    //  Function to check uniqness of the code
    // Check if input is a valid number
    if (!/^\d*$/.test(userInput)) {
      this.showNotification(
        'info',
        'Invalid Input',
        'Only numbers are allowed!'
      );
      inputElement.value = ''; // Clear the input field
      return;
    }
  }

  // Handle padding for Bank Code
  padBankCode(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let userInput = inputElement.value.trim();
    if (userInput) {
      // Pad with leading zeros to make it 4 digits
      const paddedValue = userInput.padStart(4, '0');
      // Update both the input field and the model
      inputElement.value = paddedValue;
      this.selected_bank.details.bank_code = paddedValue;
      userInput = paddedValue; // Update the userInput with padded value for the check
    }
    // Check uniqueness only if we have a selected head and code value
    if (this.selected_bank?.acc_head?.head_id && userInput) {
      this.checkCodeUniqueness(userInput, this.selected_bank.acc_head.head_id);
    }
  }
  checkCodeUniqueness(code: string, headId: number) {
    // Check if the code already exists for this head in the dataSource
    const isDuplicate = this.dataSource.data.some(
      (row: any) =>
        row.vch_bank_code === code &&
        row.int_head_id === headId &&
        (!this.editingRow || row.int_bank_id !== this.editingRow.int_bank_id)
    );
    if (isDuplicate) {
      // Show error notification
      this.showNotification(
        'warning',
        'Duplicate Code',
        'This bank code already exists for the selected account head'
      );
      // Clear or focus the field
      this.selected_bank.details.bank_code = '';
      // event.target.focus(); // if you want to focus back
    }
  }

  // Handle toggle for deactivation
  onDeactivateToggle(event: any): void {
    this.selected_bank.details.listing = event.target.checked ? 0 : 1;
  }

  async save() {
    const isValid = await this.validateAllFields();
    if (!isValid) {
      console.error('Form has validation errors:', this.errors);
      // Show the first error as a notification
      const firstError = Object.values(this.errors).find((err) => !!err); // find the first non-empty error
      if (firstError) {
        this.showNotification('warning', 'Warning', firstError as string);
      }
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
      unit_id: this.selected_bank?.unit.id || 1, // Need to integrate actual unit_id from the sessions
      secondary_id: this.selected_bank.bank_type?.secondary_id || null,
      secondary_code: this.selected_bank.bank_type?.secondary_code || null,
      bank_code: this.selected_bank.details?.bank_code || null,
      head_id: this.selected_bank.acc_head?.head_id || null,
      head_code: this.selected_bank.acc_head?.head_code || null,
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
      // state: this.selected_bank.details.state,
      state_id: this.selected_bank.details.state_id,
      // district: this.selected_bank.details.district,
      dist_id: this.selected_bank.details.dist_id,
      group_id: 8, // Static value, change if needed
      address_id: 1,
      passbook_ob: '0.00',
    };
    console.log('Payload to save:', payload);
    // Call the save API
    this.svr.fin_postservice('api/v0/save_bank', payload).subscribe(
      (response) => {
        if (response && !response.error) {
          console.log('Response:', response);
          this.showNotification(
            'success',
            'Success',
            'Bank details saved successfully!'
          );
          this.addNew(); // Reset the form after saving
          this.fetch_records();
          this.searchInput.nativeElement.value = ''; // Clear input value
          this.dataSource.filter = ''; // Reset the filter on the table
        } else {
          this.showNotification(
            'error',
            'Error',
            'Failed to save bank details'
          );
        }
      },
      (error) => {
        console.error('Error saving bank details:', error);
        this.showNotification(
          'error',
          'Error',
          'Error saving bank details. Try again!'
        );
      }
    );
  }

  async validateAllFields(): Promise<boolean> {
    // Clear previous errors
    this.errors = {};
    // console.log(
    //   'Data before validation:',
    //   JSON.parse(JSON.stringify(this.selected_bank.details))
    // );
    this.validateField('unit', this.selected_bank.unit?.unit);
    this.validateField(
      'bankType',
      this.selected_bank.bank_type?.secondary_code
    );
    this.validateField('accHead', this.selected_bank.acc_head?.head_code);
    this.validateField('bankCode', this.selected_bank.details?.bank_code);

    this.validateField('bank_name', this.selected_bank.details.bank_name);
    this.validateField('short_name', this.selected_bank.details.short_name);
    this.validateField('ifsc', this.selected_bank.details.ifsc);
    this.validateField('account_no', this.selected_bank.details.account_no);
    this.validateField('branch', this.selected_bank.details.branch);
    this.validateField('email', this.selected_bank.details.email);
    this.validateField('mobile', this.selected_bank.details.mobile);
    // this.validateField('post', this.selected_bank.details.post);
    // this.validateField('pin', this.selected_bank.details.pin);
    // Check for empty address only if other validations pass
    // Step 4: If any field error exists, skip address check
    const hasFieldErrors = Object.values(this.errors).some((error) => !!error);
    if (hasFieldErrors) {
      return false;
    }
    // Step 5: Validate address only if above validations pass
    const addressConfirmed = await this.validateAddress();
    return addressConfirmed;
  }

  async validateAddress(): Promise<boolean> {
    if (
      !this.selected_bank.details.building &&
      !this.selected_bank.details.street_name &&
      !this.selected_bank.details.place &&
      !this.selected_bank.details.main_place &&
      !this.selected_bank.details.state_id &&
      !this.selected_bank.details.dist_id &&
      !this.selected_bank.details.post &&
      !this.selected_bank.details.pin
    ) {
      const result = await Swal.fire({
        icon: 'info',
        title: 'Address is empty.',
        text: 'Do you want to continue?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });
      if (!result.isConfirmed) {
        // Switch to Address tab (adjust the index if needed)
        this.tabGroup.selectedIndex = 2; // replace `2` with the correct index for your Address tab
      }
      return result.isConfirmed;
    }
    return true;
  }

  validateField(fieldName: string, value: any): void {
    this.errors[fieldName] = ''; // Clear previous error
    // Convert value to string and trim
    const strValue = String(value || '').trim();
    // Check for empty string or whitespace
    switch (fieldName) {
      case 'unit':
        if (!this.selected_bank.unit?.unit) {
          this.errors.unit = 'Select Unit First';
        }
        break;
      case 'bankType':
        if (!this.selected_bank.bank_type?.secondary_code) {
          this.errors.bankType = 'Select Bank Type';
        }
        break;
      case 'accHead':
        if (!this.selected_bank.acc_head?.head_code) {
          this.errors.accHead = 'Select Account Head';
        }
        break;
      case 'bankCode':
        if (!this.selected_bank.details?.bank_code) {
          this.errors.bankCode = 'Please Enter Bank Code';
        }
        break;
      case 'bank_name':
        if (!strValue) {
          // Changed from !value?.trim()
          this.errors.bank_name = 'Bank Name is required.';
        }
        break;
      case 'short_name':
        if (!strValue) {
          // Changed from !value?.trim()
          this.errors.short_name = 'Short Name is required.';
        }
        break;
      case 'branch':
        if (!strValue) {
          // Changed from !value?.trim()
          this.errors.branch = 'Branch is required.';
        }
        break;
      case 'ifsc':
        if (!strValue) {
          this.errors.ifsc = 'IFSC Code is required.';
        } else if (!this.isValidIFSC(strValue)) {
          this.errors.ifsc = 'Invalid IFSC Code format';
        }
        break;
      case 'account_no':
        if (!strValue) {
          this.errors.account_no = 'Account Number is required.';
        } else if (!this.isValidAccountNumber(strValue)) {
          this.errors.account_no =
            'Account Number must be between 9 to 18 digits.';
        }
        break;
      case 'email':
        if (!strValue || !this.isValidEmail(strValue)) {
          this.errors.email = 'Valid Email is required.';
        }
        break;
      case 'mobile':
        if (!strValue || !this.isValidMobile(strValue)) {
          this.errors.mobile = 'Valid Mobile Number is required.';
        }
        break;
      // case 'post':
      //   if (!strValue) {
      //     // Changed from !value?.trim()
      //     this.errors.post = 'Post is required.';
      //   }
      //   break;
      // case 'pin':
      //   if (!strValue || !this.isValidPin(strValue)) {
      //     this.errors.pin = 'Valid Pin Number is required.';
      //   }
      //   break;
    }
    // Force change detection
    this.errors = { ...this.errors };
  }

  // Keep your existing validation helper methods
  isValidEmail(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }
  isValidMobile(mobile: string): boolean {
    return /^[0-9]{10}$/.test(mobile);
  }
  isValidPin(pin: string): boolean {
    return /^[1-9][0-9]{5}$/.test(pin);
  }
  isValidIFSC(ifsc: string): boolean {
    const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return regex.test(ifsc);
  }
  isValidAccountNumber(accountNo: string): boolean {
    const regex = /^\d{9,18}$/;
    return regex.test(accountNo);
  }
  numberOnly(event: any): boolean {
    var regex = new RegExp('^[0-9]');
    var key = String.fromCharCode(
      event.charCode ? event.which : event.charCode
    );
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
    return true;
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
