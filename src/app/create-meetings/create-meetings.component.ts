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
import { Router } from '@angular/router';
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
  isEditable: boolean = false;
  is_loading: boolean = false; // handle loader
  // Track whether the form is in Add New mode or Edit mode
  isAddMode: boolean = false;
  subject_data: any = [];
  displayedColumns: string[] = [
    'slNo',
    'meeting_code',
    'meeting_name',
    'status',
    'select',
    'delete',
  ];
  dataSource: any;
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
    user_mob: '',
    user_id: '',
  };
  flg_owner: boolean = false;
  addedUsers: any[] = []; // Stores added users
  dataSource1 = new MatTableDataSource<any>([]);
  displayedColumns1: string[] = [
    'slNo',
    'seat_name',
    'user_name',
    'email',
    'mobile',
    'owner',
    'delete',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private commonsvr: ServiceService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.language = environment.lang;
    console.log(this.language);
    this.bilingual = environment.bilingual;
    console.log(this.bilingual);
    this.fetch_meetings(); //to fetch all primary subjects
  }

  // Handle "Add New" button click
  addNewSubject() {
    this.primary_id = null; //Reset to save new subject
    this.activeRowIndex = null;
    this.isEditable = false;
    this.isAddMode = true; // Set to Add New mode
    this.showError = false; //to hide err msg
    this.deactive = false;
    // Clear the form fields for adding a new subject
    this.selectedMeetings = {
      meeting_id: '',
      meeting_code: '',
      meeting_name: '',
      meeting_name_ln: '',
    };
    this.paginator.firstPage();
  }

  // Handle "Edit" button click
  editSubject() {
    this.isEditable = true;
    this.isAddMode = false; // Set to Edit mode
    this.saveMeeting();
  }

  // Handle "Cancel" button click
  cancelEdit() {
    this.isEditable = true; // Exit edit mode
    this.isAddMode = true; // Exit edit mode
    this.primary_id = null;
    this.paginator.firstPage();
    if (this.isAddMode) {
      // Clear form in Add New mode
      this.selectedMeetings = {
        meeting_id: '',
        meeting_code: '',
        meeting_name: '',
        meeting_name_ln: '',
      };
      this.isEditable = false;
      this.isAddMode = false;
    }
    this.showError = false;
  }

  // Handle "Save" button click
  saveMeeting() {
    if (!this.validate_meeting()) {
      console.log(this.msg); // Display error message if validation fails
      return;
    }

    let data = {
      meeting_name: this.selectedMeetings.meeting_name,  // Meeting name
      office_id:  1,   // Default office ID
      child: this.addedUsers.map(user => ({
        user_id: user.user_id,      // User ID
        seat_id: user.seat_id,      // Seat ID
        flg_chair: user.flg_owner ? 1 : 0,  // Flag if chairperson
        user_name: user.user_name,  // User name
        email: user.user_email || null,  // Optional email
        mobile: user.user_mob || null,   // Optional mobile number
      }))
    };
    console.log("🚀 Posting Data:", JSON.stringify(data, null, 2)); // Debugging
    this.is_loading = true;
    this.commonsvr
      .postservice('api/v0/save_meetings', data)
      .subscribe((data: any) => {
        console.log(data);
        if (data.data) {
          this.openCustomSnackbar('success', 'Saved Successfully');
          this.primary_id = data.data.primary_id;
        } else if (data.msg === 'Fail' && data.reason === 'Duplicate Code') {
          this.msg = 'This Primary Subject Code is already in the list.!';
          this.showError = true;
        } else {
          this.openCustomSnackbar('error', 'Failed to save');
        }

        if (this.primary_id) {
          this.isEditable = true;
        }
        this.fetch_meetings();
      });
    this.isAddMode = false; // Reset mode after saving
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
      this.msg = 'Enter Primary Subject Name!';
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
        this.dataSource.paginator = this.paginator;
      });
  }

  //to get data from table to edit subject
  onRowClick(e: any, index: number): void {
    console.log('e:', e);
    this.activeRowIndex = index+1;
    this.primary_id = e.primary_id;
    this.deactive = e.active == 9 ? true : false;

    let param = {
      meeting_id:  this.activeRowIndex,
    };
    this.commonsvr.getService('api/v0/get_meeting_child', param).subscribe(
      (response: any) => {
         // ✅ Corrected `if` syntax
          console.log('Meeting Child Data:', response);
          // ✅ Correct way to assign data to MatTableDataSource
          this.dataSource1 = new MatTableDataSource<any>(response as any[]); // Use `dataSource1` to store the child data
          // ✅ Assign meeting details
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
    this.isAddMode = false; // Disable Add Mode
  }

  // apply filter based on search box entry
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Success toast
  openCustomSnackbar(type: any, msg: any) {}

  // clear error message
  clear_msg() {
    this.showError = false;
  }

  //to navigate to sub subject component
  navigate(row: any) {}

  clear_err() {}

  restrictAllEntry(e: any) {}

  add_user_tolist() {
    console.log('Before Adding:', this.selected_user); // 🔍 Debugging

    if (!this.selected_user || !this.selected_user.seat_name) {
      alert('Please select a user before adding.');
      return;
    }

    const newUser = {
      seat_name: this.selected_user.seat_name,
      seat_id: this.selected_user.seat_id,
      user_name: this.selected_user.user_name, // ✅ Ensure correct property name
      email_id: this.selected_user.email_id, // ✅ Fix typo
      mobile: this.selected_user.user_mob,
      user_id: this.selected_user.user_id,
      flg_owner: this.flg_owner, // ✅ Add owner flag
    };

    // Prevent duplicate users
    if (this.addedUsers.some(user => user.seat_id === newUser.seat_id)) {
      alert('User already added!');
      return;
    }

    this.addedUsers.push(newUser);
    this.dataSource1 = new MatTableDataSource([...this.addedUsers]); // ✅ Update table

    console.log('After Adding:', this.dataSource1); // 🔍 Debugging

    // Clear fields after adding
    this.selected_user = {
      seat_name: '',
      seat_id: '',
      user_name: '',
      email_id: '',
      user_mob: '',
      user_id: '',
    };
    this.flg_owner = false;
  }



  onClickDelete(element: any, index: number) {
    console.log('DeleteRow:', element);
    this.addedUsers.splice(index, 1);
    this.dataSource1.data = [...this.addedUsers]; // Update table
  }

  clear_user_details() {
     // Clear input fields
     this.selected_user = {
      seat_id: '',
      seat_name: '',
      user_name: '',
      email_id: '',
      user_mob: '',
      user_id: '',
    };
    console.log('Cleared user details', this.selected_user);
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
          seat_name: userData.seat_name || '',  // From `CS-FED001`
          seat_id: userData.seat_id || '',      // From `7`
          user_name: userData.title || '',      // From `Malachi Punith`
          email_id: userData.email || '',     // From `punith@kvgbank.com`
          user_mob: userData.mobile || '',      // From `8551265956`
          user_id: userData.user_id || '',      // From `3`
        };

        this.flg_owner = false; // ✅ Keep it unchecked initially
      }
      // console.log('Selected User:', this.selected_user); // 🔍 Debugging
    });
  }




}
