import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ServiceService } from '../services/service.service';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { SearchUserComponent } from '../search-user/search-user.component';

@Component({
  selector: 'app-create-meetings',
  templateUrl: './create-meetings.component.html',
  styleUrls: ['./create-meetings.component.scss'],
})
export class CreateMeetingsComponent implements OnInit {
  @Output() expandToggled = new EventEmitter<void>();
  isExpanded = false;
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    this.expandToggled.emit();
  }
  // Form model to store selected values
  selectedMeetings = {
    meeting_id: '',
    meeting_code: '',
    meeting_name: '',
    meeting_name_ln: '',
  };
  // Variable to track whether the form is in edit mode
  isEditable: boolean = false; // Controls the Edit button and form state
  isReadOnly: boolean = false; // Controls form field interactivity
  isEditing: boolean = false; // Track whether editing is in progress
  is_loading: boolean = false; // handle loader
  // Track whether the form is in Add New mode or Edit mode
  isAddMode: boolean = false;
  subject_data: any = [];
  displayedColumns: string[] = ['slNo', 'meeting_name', 'Actions'];
  dataSource = new MatTableDataSource<any>([]);
  selectedRow: any;
  primary_id: any;
  deactive: any; //to activate/ deactivate primary subject
  bilingual: any; //for handle the local languages
  language: any; // check the bilingual whether true/false
  showError: boolean = false; // for handle the vlidation errr message
  msg: string = ''; // to store validation messages
  // Active class for table row when clicks
  activeRowIndex: number | null = null; // Track the active row index
  selected_user = {
    seat_name: '',
    seat_id: '',
    user_name: '',
    email_id: '',
    mobile: '',
    user_id: '',
  };
  flg_owner: boolean = false;
  dataSource1 = new MatTableDataSource<any>([]);
  editingIndex: any; // Index of the row being edited
  displayedColumns1: string[] = [
    'slNo',
    'seat_name',
    'user_name',
    'email',
    'mobile',
    'owner',
    'actions',
  ];
  originalData: any; // Store original fetched data for comparison
  saveData: any; // Store the JSON when saving
  // fetchMeeting: any; //Store the JSON when fetching

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  constructor(
    private commonsvr: ServiceService,
    // private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.language = environment.lang;
    // console.log(this.language);
    this.bilingual = environment.bilingual;
    this.isReadOnly = false; // Enable form at first load
    // console.log(this.bilingual);
    this.fetch_meetings(); //to fetch all primary subjects
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.paginator1) {
        this.dataSource1.paginator = this.paginator1;
      }
      if (this.paginator2) {
        this.dataSource.paginator = this.paginator2;
      }
    });
  }

  // Handle "Add New" button click
  addNewSubject() {
    this.primary_id = null; // Reset to save new subject
    this.activeRowIndex = null;
    this.isEditable = false;
    this.isEditing = false;
    this.isAddMode = true; // Set to Add New mode
    this.showError = false; // Hide error message
    this.deactive = false;
    this.clearSelectedMeetings(); // Clear form fields
    // ✅ Clear the table data source
    this.dataSource1.data = [];
  }

  // Handle "Edit" button click
  editSubject() {
    this.isReadOnly = false; // Enable form fields
    this.isEditable = false; // Switch from "Edit" to "Save" button
    this.isEditing = true; // Change button label to "Save"
  }

  // Handle "Cancel" button click
  cancelEdit() {
    this.isEditable = true; // Exit edit mode
    this.isEditing = false; // Change button label back to "Edit
    this.isAddMode = true; // Exit edit mode
    this.primary_id = null;
    if (this.isAddMode) {
      this.clearSelectedMeetings();
      this.isEditable = false;
      this.isAddMode = false;
    }
    this.dataSource1.data = []; // ✅ Update MatTable data
    this.dataSource1.paginator = this.paginator1;
    this.showError = false;
  }

  // Handle "Save" button click
  saveMeeting() {
    if (!this.validate_meeting()) {
      console.error('Meeting validation failed:', this.msg);
      return;
    }
    this.saveData = {
      meeting_name: this.selectedMeetings.meeting_name,
      office_id: 1,
      child: this.dataSource1.data.map((user) => ({
        user_id: user.user_id,
        seat_id: user.seat_id,
        flg_chair: user.flg_owner ? Number(user.flg_owner) : 0, // Default to 0 if undefined
        user_name: user.user_name,
        email: user.email_id || null, // ✅ Ensure email is included
        mobile: user.mobile || null, // ✅ Ensure mobile is included
      })),
    };
    // Check if data has changed before saving
    if (this.isEditing) {
      let result = this.compareJson(this.originalData, this.saveData);
      if (!result) {
        // console.log('Triggered to save data');
        this.saveMeetingFunction();
        this.is_loading = true;
      } else {
        alert('No changes detected!');
      }
    } else {
      // console.log('Triggered to save data');
      this.saveMeetingFunction();
      this.is_loading = true;
      this.fetch_meetings(); // Refresh data after saving
      this.clearSelectedMeetings(); // Clear form fields
    }
  }

  saveMeetingFunction() {
    console.log('Before Saving:', this.dataSource1.data);
    this.commonsvr
      .postservice('api/v0/save_meetings', this.saveData)
      .subscribe((data: any) => {
        console.log('Full Response:', data);
        if (data.data) {
          this.openCustomSnackbar('success', 'Saved Successfully');
          this.primary_id = data.data.primary_id;
          // this.isReadOnly = true; // Make form read-only again
          // this.isEditable = true; // Show "Edit" button again\
          this.isAddMode = false; // Reset mode after saving
          this.dataSource1.data = []; // Clear child data
          this.fetch_meetings(); // Refresh data after saving
          this.clearSelectedMeetings(); // Clear form fields
        } else {
          this.openCustomSnackbar('error', 'Failed to save');
        }
        if (this.primary_id) {
          this.isEditable = true;
        }
        this.isEditing = false; // Change button label back to "Edit"
      });
  }

  compareJson(obj1: any, obj2: any) {
    if (!obj1) {
      obj1 = [];
    }

    try {
      // Ensure obj1 is an object (in case it's stored as a JSON string)
      if (typeof obj1 === 'string') {
        obj1 = JSON.parse(obj1);
      }
      if (typeof obj2 === 'string') {
        obj2 = JSON.parse(obj2);
      }
      // Ensure both are JSON strings before comparison
      let compData1 = JSON.stringify(obj1, null, 2);
      let compData2 = JSON.stringify(obj2, null, 2);
      console.log('Object 1:', compData1);
      console.log('Object 2:', compData2);
      let compare = this.commonsvr.checkJsonEquality(compData1, compData2);
      console.log('Comparison Result:', compare);
      return compare;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return false;
    }
  }

  // check if all data entry are valid
  validate_meeting() {
    // Clear error messages before validation
    this.msg = '';
    this.showError = false;
    // Check if  Subject Code is empty or undefined
    // if (this.selectedMeetings.meeting_code == '' || this.selectedMeetings.meeting_code.trim().length === 0) {
    //   this.msg = "Enter Primary Subject Code!";
    //   this.showError = true;
    //   return false;
    // }
    // // Check if Subject Code has at least 3 characters
    // if (this.selectedMeetings.meeting_code.trim().length !== 2) {
    //   this.msg = "Primary Subject Code must have 2 characters!";
    //   this.showError = true;
    //   return false;
    // }
    // Check if  Subject Name is empty or undefined
    if (
      this.selectedMeetings.meeting_name == '' ||
      this.selectedMeetings.meeting_name.trim().length === 0
    ) {
      this.msg = 'Enter Meeting Name!';
      this.showError = true;
      return false;
    }
    // if (this.bilingual) {
    //   if (!this.selectedMeetings.meeting_name || this.selectedMeetings.meeting_name.trim().length === 0) {
    //     this.showError = true;
    //     this.msg = 'Enter Primary Subject Name in local language';
    //     return false;
    //   }
    // }
    // If all checks pass
    return true;
  }

  // function to  fetch all subjects
  fetch_meetings() {
    let param = {
      officeId: 1,
    };
    this.commonsvr
      .getService('api/v0/get_meetings', param)
      .subscribe((res: any) => {
        // this.commonsvr.getMeetings(1).subscribe((res: any) => {
        // console.log('Response:', res);
        this.subject_data = res;
        this.dataSource = new MatTableDataSource(this.subject_data);
        this.is_loading = false;
        this.dataSource.paginator = this.paginator2;
      });
  }

  //to get data from table to edit subject
  onRowClick(e: any, index: number): void {
    // console.log('e:', e);
    this.activeRowIndex = index + 1;
    this.primary_id = e.primary_id;
    this.deactive = e.active == 9 ? true : false;
    let param = {
      meeting_id: this.activeRowIndex,
    };
    this.commonsvr.getService('api/v0/get_meeting_child', param).subscribe(
      (response: any) => {
        console.log('Child Data:', response);
        // Merge API data when row is clicked
        this.originalData = JSON.stringify(
          this.mergeMeetingsAndMembers([e], response),
          null,
          2
        );
        this.dataSource1 = new MatTableDataSource<any>(response as any[]); // Use `dataSource1` to store the child data
        this.dataSource1.data = this.dataSource1.data.map((item) => ({
          ...item,
          flg_owner: Boolean(item.flg_chair), //  Convert flg_chair to boolean
        }));
        this.dataSource1.paginator = this.paginator1;
        //  Assign meeting details
        this.selectedMeetings = {
          meeting_id: e.meeting_id,
          meeting_code: e.meeting_code,
          meeting_name: e.meeting_name,
          meeting_name_ln: e.meeting_name_ln,
        };
      },
      (error) => {
        console.error('Error fetching meeting child data:', error);
        // Handle errors (e.g., show a message to the user)
      }
    );
    this.showError = false;
    this.isEditable = true; // The form starts in view mode
    this.isReadOnly = true; // Disable form fields
    this.isAddMode = false; // Disable Add Mode
  }

  mergeMeetingsAndMembers(meetings: any[], members: any[]) {
    return meetings.map((meeting) => ({
      meeting_name: meeting.meeting_name,
      office_id: 1,
      child: members
        .filter((member) => member.meeting_id === meeting.meeting_id)
        .map((member) => ({
          user_id: member.user_id,
          seat_id: member.seat_id,
          flg_chair: Number(member.flg_chair), // Ensure number type
          user_name: member.user_name,
          email: member.email || null, // Instead of email_id
          mobile: member.mobile || null,
        })),
    }));
  }

  // apply filter based on search box entry
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator = this.paginator2;
  }

  // Success toast
  openCustomSnackbar(type: any, msg: any) {
    const snackbar = document.createElement('div');
    snackbar.className = `custom-snackbar ${type}`;
    snackbar.innerText = msg;

    document.body.appendChild(snackbar);

    setTimeout(() => {
      snackbar.classList.add('show');
    }, 100);

    setTimeout(() => {
      snackbar.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(snackbar);
      }, 300);
    }, 3000);
  }

  // clear error message
  clear_msg() {
    this.showError = false;
  }

  clearSelectedMeetings() {
    // Clear the form fields for adding a new subject
    this.selectedMeetings = {
      meeting_id: '',
      meeting_code: '',
      meeting_name: '',
      meeting_name_ln: '',
    };
  }

  //to navigate to sub subject component
  navigate(row: any) {}

  clear_err() {}

  restrictAllEntry(e: any) {}

  add_user_tolist() {
    // console.log('Before Adding:', this.selected_user);
    if (!this.selected_user || !this.selected_user.seat_name) {
      // alert('Please select a user before adding.');
      this.msg = 'Please select a user before adding.';
      this.showError = true;
      return;
    }
    const newUser = {
      seat_name: this.selected_user.seat_name,
      seat_id: this.selected_user.seat_id,
      user_name: this.selected_user.user_name,
      email_id: this.selected_user.email_id,
      mobile: this.selected_user.mobile,
      user_id: this.selected_user.user_id,
      flg_owner: this.flg_owner, // ✅ Keep owner flag
    };
    // Ensure addedUsers contains the current data
    const currentUsers = this.dataSource1.data;
    if (this.editingIndex !== undefined && this.editingIndex !== null) {
      // If editing, update the existing row
      currentUsers[this.editingIndex] = newUser;
      this.editingIndex = null; // Reset editing index
    } else {
      // If adding a new user, prevent duplicates
      if (currentUsers.some((user) => user.seat_id === newUser.seat_id)) {
        alert('User already added!');
        return;
      }
      currentUsers.push(newUser); // Add new user
    }
    this.dataSource1.data = [...currentUsers];
    this.dataSource1.paginator = this.paginator1;
    // Clear fields after adding
    this.clear_user_details();
  }

  get isOwnerExists(): boolean {
    return this.dataSource1.data.some((user) => user.flg_owner);
  }

  onClickEdit(element: any, index: number) {
    // console.log('EditRow:', element);
    // Bind selected row's data to the form fields
    this.selected_user = {
      seat_name: element.seat_name,
      seat_id: element.seat_id,
      user_name: element.user_name,
      email_id: element.email_id,
      mobile: element.mobile,
      user_id: element.user_id,
    };
    // Set the owner flag
    this.flg_owner = element.flg_owner;
    // Store index to update the correct row later when user clicks "Add"
    this.editingIndex = index;
  }

  onClickDelete(element: any, index: number) {
    const userIndex = this.dataSource1.data.findIndex(
      (user) => user.user_id === element.user_id
    );
    if (userIndex !== -1) {
      this.dataSource1.data.splice(userIndex, 1); // Remove user
      this.dataSource1.paginator = this.paginator1;
    }
  }

  clear_user_details() {
    // Clear input fields
    this.selected_user = {
      seat_id: '',
      seat_name: '',
      user_name: '',
      email_id: '',
      mobile: '',
      user_id: '',
    };
    if (this.flg_owner) {
      this.flg_owner = false;
    }
    // console.log('Cleared user details', this.selected_user);
  }

  // Open user search dialog from modal
  openUserSearch() {
    const dialogRef = this.dialog.open(SearchUserComponent, {
      width: '1130px',
    });
    dialogRef?.afterClosed().subscribe((response: any) => {
      // console.log('Modal Response:', response); // 🔍 Debugging
      if (response && response.data) {
        const userData = response.data;
        // ✅ Map response keys to match selected_user structure
        this.selected_user = {
          seat_name: userData.seat_name || '', // From `CS-FED001`
          seat_id: userData.seat_id || '', // From `7`
          user_name: userData.title || '', // From `Malachi Punith`
          email_id: userData.email || '', // From `punith@kvgbank.com`
          mobile: userData.mobile || '', // From `8551265956`
          user_id: userData.user_id || '', // From `3`
        };
        this.flg_owner = false; // ✅ Keep it unchecked initially
      }
      // console.log('Selected User:', this.selected_user); // 🔍 Debugging
    });
  }
}
