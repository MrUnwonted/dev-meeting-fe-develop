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
  head_list: any = [];
  selected_bank: any = {}; // **Unified object**

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
  }

  init() {
    this.isReadOnly = false;
    this.isAdding = true;
    this.isEditing = false;
    this.selected_bank = {
      unit: { id: '', code: '', unit: '' },
      bank_type: { secondary_id: '', secondary_code: '', secondary_head: '' },
      acc_head: { head_code: '' },
      details: {
        code: '',
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
        console.log('Unit Selected', this.selected_bank);
      });
    }
  }

  callOpenBankType() {
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

  open_bank_type() {
    if (this.isAdding) {
      const dialogRef = this.dialog.open(SearchSecondaryHeadsComponent, {
        width: '1130px',
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
            acc_head: { head_code: userData.vch_head_code },
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
      unit: { id: row.id, code: row.code, unit: row.unit },
      bank_type: {
        secondary_id: row.int_secondary_id,
        secondary_code: row.vch_secondary_code,
        secondary_head: row.vch_secondary_head,
      },
      acc_head: { head_code: row.vch_head_code },
      details: {
        code: row.code, // Include code from row
        bank_name: row.vch_bank,
        short_name: row.vch_short_desc,
        ifsc: row.vch_ifsc,
        account_no: row.vch_acc_no,
        email: row.vch_email,
        mobile: row.vch_mobile,
        building: row.vch_building,
        street_name: row.vch_street,
        place: row.vch_place,
        main_place: row.vch_main_place,
        district: row.vch_district,
        post: row.vch_post,
        pin: row.vch_pin,
        branch: row.vch_branch || '',
        passbook_ob: row.passbook_ob || 0,
        address_id: row.address_id || null,
        listing: row.listing || 1,
        state_id: row.state_id || null,
        dist_id: row.dist_id || null,
      },
    };
    console.log('Selected Row', this.selected_bank);
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
        // console.log('Bank Details:', res);
        // Populate bank_details from API response
        this.selected_bank = {
          ...this.selected_bank, // Preserve existing values
          details: {
            code: res.code ?? '', // Ensure code is included
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
            passbook_ob: res.passbook_ob ?? 0,
            address_id: res.address_id ?? null,
            listing: res.listing ?? 1,
            state_id: res.state_id ?? null,
            dist_id: res.dist_id ?? null,
          },
        };
      },
      (error) => {
        console.error('Error fetching bank details:', error);
        this.showNotification('error', 'Error', 'Failed to load bank details');
      }
    );
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

  save() {
    let payload = {
      unit_id: this.selected_bank.unit.id,
      secondary_head_id: this.selected_bank.bank_type.secondary_id,
      bank_code: this.selected_bank.acc_head.head_code,
      bank: this.selected_bank.details.bank_name,
      short_desc: this.selected_bank.details.short_name,
      acc_no: this.selected_bank.details.account_no,
      ifsc: this.selected_bank.details.ifsc,
      branch: this.selected_bank.details.branch, // Now always exists
      mobile: this.selected_bank.details.mobile,
      email: this.selected_bank.details.email,
      passbook_ob: this.selected_bank.details.passbook_ob, // Now always exists
      address_id: this.selected_bank.details.address_id, // Now always exists
      listing: this.selected_bank.details.listing, // Now always exists
      building: this.selected_bank.details.building,
      street: this.selected_bank.details.street_name,
      place: this.selected_bank.details.place,
      main_place: this.selected_bank.details.main_place,
      state_id: this.selected_bank.details.state_id,
      district: this.selected_bank.details.district, // Changed from dist_id for consistency
      post: this.selected_bank.details.post,
      pin: this.selected_bank.details.pin,
      group_id: 8,
    };
    console.log('Payload to save:', payload);

    if (payload) return;

    this.svr.fin_postservice('api/v0/save_bank', payload).subscribe(
      (response) => {
        if (response && response.success) {
          Swal.fire('Success', 'Bank details saved successfully!', 'success');
          this.fetch_records(); // Refresh the table after saving
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
