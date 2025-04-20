import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SearchTranactionTypesComponent } from '../modals/search-tranaction-types/search-tranaction-types.component';
import { SearchBanksComponent } from '../modals/search-banks/search-banks.component';
import { SearchApplicantComponent } from '../modals/search-applicant/search-applicant.component';
import { SearchPropertyTaxComponent } from '../modals/search-property-tax/search-property-tax.component';
import { SearchAccountHeadsComponent } from '../modals/search-account-heads/search-account-heads.component';
import Swal from 'sweetalert2';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-demands',
  templateUrl: './demands.component.html',
  styleUrl: './demands.component.scss',
})
export class DemandsComponent {
  trn_list: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('transactionType') transactionType!: ElementRef;

  displayedColumns: string[] = [
    'sl',
    'headCode',
    'head',
    'year',
    'period',
    'amount',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();
  selectedDate: Date | null = null;
  selectedOption: any;
  selectedTransactionType: any = {};
  selectedPropertyTax: any = {};
  selectedApplicant: any = {};
  selectedBank: any = {};
  selectedType: any = {};
  selectedHead: any = {};
  instrument_options = [
    { id: 1, label: 'DD' },
    { id: 2, label: 'Cheque' },
  ];
  collection_options = [
    { id: 1, label: 'Direct Collection' },
    { id: 2, label: 'OutDoor Collection' },
  ];
  information: any = {};
  // selected_collection_option: any;
  selected_collection_option: any = 1;
  cash_mode = 1; // Default to Cash
  cashHeadCode = '450100000'; // Example cash head code
  minDate: Date;
  grandTotal: number = 0;
  itemCount: number = 0;
  enableRounding: boolean = true; // turn ON or OFF rounding logic
  editIndex: number = -1; // Add this class variable
  demandNumber: number = 518405; // Add this class variable

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private svr: ServiceService,
  ) {
    this.selectedOption = 1;
    // Set minimum date to today
    this.minDate = new Date();
    // Optional: If you want to include today's date but disable previous dates
    // this.minDate.setHours(0, 0, 0, 0); // This sets time to midnight to ensure today is included
  }

  ngOnInit() {
    this.init();
    this.addNew();
    this.fetch_trn_list();
  }

  init() {
    this.selectedTransactionType = {
      type_id: null,
      trans_type: null,
      short_desc: null,
    };
    this.selectedApplicant = {
      name: null,
      email: null,
      mobile: null,
      building: null,
      main_place: null,
      post: null,
      pin: null,
      district: null,
      state: null,
      addr_id: null,
      dob: null,
      gender: null,
      img: null,
      img_path: null,
      profile_code: null,
      profile_id: null,
      profile_type: null,
      uid: null,
    };
    this.selectedPropertyTax = {
      type_id: null,
    };
    this.selectedHead = {
      head_code: null,
      head_id: null,
      head: null,
      year: null,
      period: null,
      amount: null,
    };
    this.selectedBank = {
      bank_code: null,
      bank: null,
      acc_no: null,
      short_desc: null,
      unit: null,
      branch: null,
      head_code: null,
      email: null,
      ifsc: null
    };
    // Scroll to the Unit input field
    setTimeout(() => {
      this.transactionType?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);
  }

  addNew() {
    this.init();
  }

  getAccountHead() {
    switch (this.cash_mode) {
      case 1: // Cash
        return this.cashHeadCode;
      case 2: // Bank
        return this.selectedBank.head_code || '—';
      default:
        return '—';
    }
  }

  fetch_trn_list() {
    const stored = sessionStorage.getItem('trn_list');
    if (stored) {
      this.trn_list = JSON.parse(stored).map((item: any) => ({
        ...item,
        year: typeof item.year === 'number'
          ? new Date(item.year, 0, 1) // Convert legacy year numbers to Date
          : new Date(item.year)        // Keep Date objects
      }));
    } else {
      this.trn_list = [ /* your default mock values */];
    }

    this.dataSource = new MatTableDataSource(this.trn_list);
    this.dataSource.paginator = this.paginator;
    this.itemCount = this.dataSource.data.length;
    this.updateGrandTotal();
  }

  // fetch_trn_list() {
  //   this.trn_list = [
  //     {
  //       sl: 1,
  //       headCode: '101',
  //       head: 'Loreum Ipsum',
  //       year: 1020,
  //       period: 1020,
  //       amount: 1020,
  //     },
  //     {
  //       sl: 2,
  //       headCode: '102',
  //       head: 'Loreum Ipsum',
  //       year: 420,
  //       period: 420,
  //       amount: 420,
  //     },
  //     {
  //       sl: 3,
  //       headCode: '103',
  //       head: 'Loreum Ipsum',
  //       year: 140,
  //       period: 140,
  //       amount: 140,
  //     },
  //     {
  //       sl: 4,
  //       headCode: '104',
  //       head: 'Loreum Ipsum',
  //       year: 70,
  //       period: 70,
  //       amount: 70,
  //     },
  //     {
  //       sl: 5,
  //       headCode: '105',
  //       head: 'Loreum Ipsum',
  //       year: 1270,
  //       period: 1270,
  //       amount: 1270,
  //     },
  //     {
  //       sl: 6,
  //       headCode: '106',
  //       head: 'Loreum Ipsum',
  //       year: 10020,
  //       period: 10020,
  //       amount: 10020,
  //     },
  //     {
  //       sl: 7,
  //       headCode: '107',
  //       head: 'Loreum Ipsum',
  //       year: 6020,
  //       period: 6020,
  //       amount: 6020,
  //     },
  //     {
  //       sl: 8,
  //       headCode: '107',
  //       head: 'Loreum Ipsum',
  //       year: 5020,
  //       period: 5020,
  //       amount: 5020,
  //     },
  //   ];
  //   this.dataSource = new MatTableDataSource(this.trn_list);
  //   this.dataSource.paginator = this.paginator;
  // }

  // onOptionChange(value: any): void {
  //   console.log(value);

  //   this.selectedOption = value;
  // }

  open_transactions() {
    const dialogRef = this.dialog.open(SearchTranactionTypesComponent, {
      width: '1130px',
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (!response || !response.data) {
        console.log('Transaction dialog canceled. No changes applied.');
        return; // Do nothing if dialog was canceled
      }
      if (response && response.data) {
        const userData = response.data;
        this.selectedTransactionType = {
          type_id: userData.type_id,
          trans_type: userData.trans_type,
          short_desc: userData.short_desc,
        };
        if (
          response.data.trans_type.toString() === 'Property Tax Collection '
        ) {
          this.search_property_tax();
        }
        console.log(response);
      }
    });
  }

  open_bank() {
    const dialogRef = this.dialog.open(SearchBanksComponent, {
      width: '1130px',
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (!response || !response.data) {
        console.log('Bank dialog canceled. No changes applied.');
        return; // Do nothing if dialog was canceled
      }
      if (response && response.data) {
        const userData = response.data;
        this.selectedBank = {
          bank_code: userData.vch_bank_code,
          bank: userData.vch_bank,
          acc_no: userData.vch_acc_no,
          short_desc: userData.vch_short_desc,
          unit: userData.vch_unit,
          branch: userData.vch_branch,
          head_code: userData.vch_head_code,
          ifsc: userData.vch_ifsc,
          email: userData.vch_email,
        };
      }
    });
  }

  Search_applicant() {
    const dialogRef = this.dialog.open(SearchApplicantComponent, {
      width: '1130px',
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (!response || !response.data) {
        console.log('Applicant dialog canceled. No changes applied.');
        return; // Do nothing if dialog was canceled
      }
      console.log('Applicant', response);
      if (response && response.data) {
        const userData = response.data;
        this.selectedApplicant = {
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          building: userData.building,
          main_place: userData.main_place,
          post: userData.post,
          pin: userData.pin,
          district: userData.district,
          state: userData.state,
          addr_id: userData.addr_id,
          dob: userData.dob,
          gender: userData.gender,
          img: userData.img,
          img_path: userData.img_path,
          profile_code: userData.profile_code,
          profile_id: userData.profile_id,
          profile_type: userData.profile_type,
          uid: userData.uid,
        };
      }
    });
  }

  callOpenAccountHeads() {
    // if (this.isAdding) {
    // console.log('Selected Unit', this.selected_unit);
    this.open_account_head();
    // }
  }

  // Open the search dialog for selecting an account head
  open_account_head() {
    // if (this.isAdding) {
    const dialogRef = this.dialog.open(SearchAccountHeadsComponent, {
      width: '1130px',
      data: { filterParam: '274' },
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (!response || !response.data) {
        console.log('Account head dialog canceled. No changes applied.');
        return; // Do nothing if dialog was canceled
      }
      const userData = response.data;
      this.selectedHead = {
        head_code: userData.vch_head_code,
        head_id: userData.int_head_id,
        head: userData.vch_head,
        year: new Date(),
      };
      // Set the combined display value
      // this.accountHeadDisplay = `${userData.vch_head_code}-${userData.vch_head}`;
      console.log('Selected Row', this.selectedHead);
      // console.log('Account Head Display', this.accountHeadDisplay);
    });
    // }
  }
  // In your component
  validateYear() {
    if (this.selectedHead.year && this.selectedHead.year < this.minDate) {
      this.selectedHead.year = new Date(); // Reset to today if invalid
    }
  }

  addNewHead() {
    if (!this.selectedHead.head_code || !this.selectedHead.head) {
      this.showNotification('info', 'Info', 'Please fill Head Code and Account Head');
      return;
    }

    const entryData = {
      sl: this.editIndex !== -1 ? this.trn_list[this.editIndex].sl : this.trn_list.length + 1,
      headCode: this.selectedHead.head_code,
      head: this.selectedHead.head,
      year: this.selectedHead.year, // Keep as Date object
      period: this.selectedHead.period,
      amount: this.selectedHead.amount,
    };

    if (this.editIndex !== -1) {
      // Update existing entry
      this.trn_list[this.editIndex] = entryData;
      this.editIndex = -1; // Reset edit mode
    } else {
      // Add new entry
      this.trn_list.push(entryData);
    }

    this.dataSource.data = [...this.trn_list];
    this.itemCount = this.dataSource.data.length;
    sessionStorage.setItem('trn_list', JSON.stringify(this.trn_list));
    this.updateGrandTotal();
    this.addNew();
  }
  updateGrandTotal() {
    this.grandTotal = this.trn_list.reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
  }
  roundOffAmountIfNeeded() {
    if (this.enableRounding && this.selectedHead.amount != null) {
      const amount = parseFloat(this.selectedHead.amount);
      this.selectedHead.amount = Math.ceil(amount);
    }
  }
  deleteRow(index: number) {
    this.trn_list.splice(index, 1);
    this.recalculateSerialNumbers();
    this.dataSource.data = [...this.trn_list];
    sessionStorage.setItem('trn_list', JSON.stringify(this.trn_list));
    this.fetch_trn_list();
    this.updateGrandTotal();
    // this.recalculateSerialNumbers();
  }
  recalculateSerialNumbers() {
    this.trn_list.forEach((item: any, idx: any) => item.sl = idx + 1);
  }
  editRow(element: any, index: number) {
    console.log('Editing element:', element); // Debug log
    this.editIndex = index;
    this.selectedHead = {
      head_code: element.headCode || element.head_code, // Handle both cases
      head: element.head,
      year: new Date(element.year), // Preserve the original date
      period: element.period,
      amount: element.amount
    };
  }

  save() {
    this.showNotification('info', 'Info', 'Save functionlity is on its way');
    let payload: any = {};
    payload = {

    };
    this.demandNumber= 2200344;
// Before save
    // console.log('Payload to save:', payload);
    // this.svr.fin_postservice('api/v0/save_demands', payload).subscribe(
    //   (response) => {
    //     if (response && !response.error) {
    //       console.log('Response:', response);
    //       this.showNotification(
    //         'success',
    //         'Success',
    //         'Bank details saved successfully!'
    //       );
    //       this.addNew(); // Reset the form after saving
    //       this.fetch_trn_list();
    //       // this.searchInput.nativeElement.value = ''; // Clear input value
    //       this.dataSource.filter = ''; // Reset the filter on the table
    //     } else {
    //       this.showNotification(
    //         'error',
    //         'Error',
    //         'Failed to save bank details'
    //       );
    //     }
    //   },
    //   (error) => {
    //     console.error('Error saving bank details:', error);
    //     this.showNotification(
    //       'error',
    //       'Error',
    //       'Error saving bank details. Try again!'
    //     );
    //   }
    // );
  }



  search_property_tax() {
    const dialogRef = this.dialog.open(SearchPropertyTaxComponent, {
      width: '1130px',
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      if (!response || !response.data) {
        console.log('Property Tax dialog canceled. No changes applied.');
        return; // Do nothing if dialog was canceled
      }
      if (response && response.data) {
        const userData = response.data;
        this.selectedPropertyTax.type_id = userData.type_id;
      }
    });
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
