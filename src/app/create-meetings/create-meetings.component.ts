import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
  styleUrls: ['./create-meetings.component.scss']
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
    meeting_name_ln: ''
  };

  // Variable to track whether the form is in edit mode
  isEditable: boolean = false;
  is_loading:boolean =false // handle loader
  // Track whether the form is in Add New mode or Edit mode
  isAddMode: boolean = false;
  subject_data: any = [];
  displayedColumns: string[] = ['slNo', 'meeting_code', 'meeting_name',  'status', 'select', 'delete'];
  dataSource: any;
  selectedRow: any;
  primary_id: any;
  deactive: any; //to activate/ deactivate primary subject
  bilingual: any; //for handle the local languages
  language: any; // check the bilingual whether true/false
  showError: boolean = false;// for handle the vlidation errr message
  msg: string = '';// to store validation messages

    // Active class for table row when clicks
    activeRowIndex: number | null = null; // Track the active row index

    selected_user={
      seat_name:'',
      seat_id:'',
      user_name:'',
      user_eamil:'',
      user_mob:'',
      user_id:''
    };
    flg_owner:boolean = false;
    dataSource1:any;
    displayedColumns1: string[] = ['slNo', 'seat_name', 'user_name', 'email', 'mobile','delete'];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private commonsvr: ServiceService, 
    private router:Router,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.language = environment.lang;
    console.log(this.language);
    this.bilingual = environment.bilingual;
    console.log(this.bilingual);
  //  this.fetch_meetings(); //to fetch all primary subjects
  }

  // Handle "Add New" button click
  addNewSubject() {
    this.primary_id = null;//Reset to save new subject
    this.activeRowIndex =null;
    this.isEditable = false;
    this.isAddMode = true; // Set to Add New mode
    this.showError = false;//to hide err msg
    this.deactive = false;
    // Clear the form fields for adding a new subject
    this.selectedMeetings = {
      meeting_id: '',
      meeting_code: '',
      meeting_name: '',
      meeting_name_ln: ''
    };
    this.paginator.firstPage();
  }

  // Handle "Edit" button click
  editSubject() {
    this.isEditable = true;
    this.isAddMode = false; // Set to Edit mode
    this.saveMeeting()
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
        meeting_name_ln: ''
      };
      this.isEditable = false;
      this.isAddMode = false;

    }
    this.showError = false;
  }

  // Handle "Save" button click
  saveMeeting() {
    if (!this.validate_meeting()) {
      console.log(this.msg);  // Display error message if validation fails
      return;
    }

    let data = {
      "primary_id": this.selectedMeetings.meeting_id,
      "primary_code": this.selectedMeetings.meeting_code.toUpperCase(),
      "primary_subject": this.selectedMeetings.meeting_name,
      "primary_subject_ln": this.selectedMeetings.meeting_name_ln, // this.sub_name,
      "active": this.deactive == true ? 9 : 1,
    }
    this.is_loading=true
    this.commonsvr.postservice("api/v0/save_primary_subjects", data).subscribe((data: any) => {
      console.log(data);
      if (data.data) {
        this.openCustomSnackbar('success', 'Saved Successfully');
        this.primary_id = data.data.primary_id;
      } else if (data.msg === 'Fail' && data.reason === 'Duplicate Code') {
        this.msg = "This Primary Subject Code is already in the list.!";
        this.showError = true;
      } else {
        this.openCustomSnackbar('error', 'Failed to save');
      }

      if (this.primary_id) {
        this.isEditable = true;
      }
      this.fetch_meetings();
   
    })
    this.isAddMode = false; // Reset mode after saving
  }

  // check if all data entry are valid
  validate_meeting() {
    // Clear error messages before validation
    this.msg = '';
    this.showError = false;

    // Check if  Subject Code is empty or undefined
    if (this.selectedMeetings.meeting_code == '' || this.selectedMeetings.meeting_code.trim().length === 0) {
      this.msg = "Enter Primary Subject Code!";
      this.showError = true;
      return false;
    }
    // // Check if Subject Code has at least 3 characters
    if (this.selectedMeetings.meeting_code.trim().length !== 2) {
      this.msg = "Primary Subject Code must have 2 characters!";
      this.showError = true;
      return false;
    }


    // Check if  Subject Name is empty or undefined
    if (this.selectedMeetings.meeting_name == '' || this.selectedMeetings.meeting_name.trim().length === 0) {
      this.msg = "Enter Primary Subject Name!";
      this.showError = true;
      return false;
    }



    if (this.bilingual) {
      if (!this.selectedMeetings.meeting_name || this.selectedMeetings.meeting_name.trim().length === 0) {
        this.showError = true;
        this.msg = 'Enter Primary Subject Name in local language';
        return false;
      }
    }

    // If all checks pass
    return true;
  }


  // function to  fetch all subjects
  fetch_meetings() {
    this.commonsvr.getService('api/v0/get_all_meetings').subscribe((res: any) => {
      console.log(res);
      this.subject_data = res;
      this.dataSource = new MatTableDataSource(this.subject_data);
      this.is_loading=false
      this.dataSource.paginator = this.paginator;

    });

  }

  //to get data from table to edit subject
  onRowClick(e: any,index:number): void {
    console.log(e);
    this.activeRowIndex = index;
    this.primary_id = e.primary_id;
    this.deactive = e.active == 9 ? true : false;
    this.selectedMeetings = {
      meeting_id: "1",
      meeting_code: e.primary_code,
      meeting_name: e.primary_subject,
      meeting_name_ln: e.primary_subject_ln
    };
    this.showError = false;
    this.isEditable = true; // The form starts in view mode
    this.isAddMode = false;  // Disable Add Mode
  }

  // apply filter based on search box entry
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Success toast
  openCustomSnackbar(type: any, msg: any) {
   
  }


  // clear error message
  clear_msg() {
    this.showError = false
  }

  //to navigate to sub subject component
  navigate(row:any){
   
  }

  clear_err(){

  }


  restrictAllEntry(e:any){

  }

  add_user_tolist(){

  }

  clear_user_details(){

  }

  openUserSearch(){
    var dialogRef = this.dialog.open(SearchUserComponent, {
      width: "1130px"
    })
    dialogRef?.afterClosed().subscribe((data: any) => {
      console.log(data)
  });
  }
}
