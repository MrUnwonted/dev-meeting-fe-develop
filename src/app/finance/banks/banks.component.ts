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

  displayedColumns: string[] = ['bank', 'accountno', 'code', 'head'];
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

  data_list: any;

  constructor(
    private dialog: MatDialog,
    private svr: ServiceService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.init();
    this.fetch_records();
  }

  fetch_records() {
    this.data_list = [
      { code: '4002015', bank: 'ICICI', accountno: '522 000 1022 036' },
      { code: '4002015', bank: 'ICICI', accountno: '522 000 1022 036' },
      { code: '4002015', bank: 'ICICI', accountno: '522 000 1022 036' },
      { code: '4002015', bank: 'ICICI', accountno: '522 000 1022 036' },
    ];

    this.dataSource = new MatTableDataSource(this.data_list);
    this.dataSource.paginator = this.paginator;
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
  }

  open_units() {
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
    console.log('Triggered account head');
    if (this.isAdding) {
      const dialogRef = this.dialog.open(SearchAccountHeadsComponent, {
        width: '1130px',
        data: { filterParam: this.selected_bank_type.secondary_code }, 
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
          console.log('Selected Row', this.selected_acc_head);
        }
      });
    }
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
