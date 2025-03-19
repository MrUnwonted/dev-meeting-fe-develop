import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ServiceService } from '../services/service.service';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent implements OnInit {

  displayedColumns: string[] = ['user_name', 'user_code', 'designation', 'email'];
  dataSource: any = [];
  office_list: any = [];
  user_list: any = [];
  emp_name: any;
  emp_code: any
  phone_num: any;
  email: any;
  department: any
  section: any
  seat: any
  department_list: any[] = [];
  office_id : any
  section_list : any [] = []
  Seat_list : any [] = []
  res_data_sections:  any [] = []
  res_data_seats:  any [] = []
  is_message: boolean = true;
  employee_data: any [] = []
  selected_data: any




  activeRowIndex: number | null = null;

  // Modal footer buttons
  modalButtons = [

    { text: 'Cancel',
      className: 'btn btn-outline-primary-90 xs',
      action: this.closeModal.bind(this)
    },
    { text: 'Select',
      className: 'btn btn-primary-90 xs',
      action: this.select_row.bind(this)
     },
  ];

  constructor(
    private dialogRef: MatDialogRef<any>,
    private svr: ServiceService,
    @Inject(MAT_DIALOG_DATA) public data : any

  ) { }

  ngOnInit(): void {
    this.get_departments()
    this.is_message = false;
    this.get_sections()
    this.get_seat()
  }

  rowActive(row: any,index: number) {
    this.activeRowIndex = index;
    this.selected_data =  row;

  }

  closeModal(): void {
    this.dialogRef.close({});
  }

  alphaNumeric(event: KeyboardEvent): boolean {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement) {
      return false;
    }
    const charCode = event.which ? event.which : event.keyCode;

    if (
      (charCode >= 48 && charCode <= 57) ||
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122)
    ) {
      if (inputElement.value.length < 10) {
        return true;
      }
    }

    return false;
  }

  numberOnly(event: any): boolean {
    var regex = new RegExp("^[0-9]");
    var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
    return true
  }

  go() {
    this.clean_up()
    let param = {
      "emp_code": this.emp_code
    }
    this.svr.postservice("api/v0/get_userby_empcode", param).subscribe((res: any) => {
      if (res.length !== 0) {
        // console.log("  test ");
        this.is_message = false;
        this.user_list = res
      } else {
        this.is_message = true;
      }

    })
  }

  save() {
    this.clean_up()
    let param = {

      "dept_id": this.department?.dept_id,
      "user_name": this.emp_name,
      "section_id": this.section?.section_id,
      "seat_id": this.seat?.int_seat_id,
      "mobile": this.phone_num,
      "email": this.email,
    }

    this.svr.postservice("api/v0/get_emp_list", param).subscribe((res: any) => {
      // console.log(JSON.stringify(res, null, 2));

      if (res.length !== 0) {
        this.is_message = false;
        this.user_list = res
      }

    })

  }

  isButtonDisabled(emailRef: any): boolean {
    const isNameValid = this.emp_name?.length >= 3;
    const isEmailValid = !this.email || !emailRef?.invalid;
    const isPhoneValid = !this.phone_num || this.phone_num.length === 10;
    const isDepartmentValid = !!this.department;
    const isSectionValid = !!this.section;
    const isSeatValid = !!this.seat;
    const isAnyFieldFilled = isNameValid || !!this.phone_num || !!this.email || isDepartmentValid || isSectionValid || isSeatValid;

    return !(isAnyFieldFilled && isEmailValid && isPhoneValid);
  }

  get_departments() {
    this.svr.getService("api/v0/get_departments").subscribe((res: any) => {
        this.department_list = res;
    });
}

department_data() {
    this.get_sections();
}

get_sections() {
    // console.log("Testing if it's working or not");

    let param = {
        "office_id": 1
    };

    this.svr.postservice("api/v0/get_sections", param).subscribe((res: any) => {
        this.res_data_sections = res;
        if (this.department === undefined) {
            this.section_list = res;
        } else {
            this.section_list = this.res_data_sections.filter((sectiondata: { dept_id: any }) => sectiondata.dept_id === this.department.dept_id);
        }
    });
}

get_seat() {
    let param = {
        "office_id": 1,
        "section_id": this.section?.section_id
    };

    this.svr.postservice("api/v0/get_seats_details_by_office_id", param).subscribe((res: any) => {
        this.res_data_seats = res;
        if (this.section === undefined) {
            this.Seat_list = res;
        } else {
            this.Seat_list = this.res_data_seats.filter((seatdata: { section_id: any }) => seatdata.section_id === this.section.section_id);
        }
    });
}

  select_row() {
    if(this.selected_data) {
      this.dialogRef.close({result: "selected data", "data": this.selected_data})
    }
  }

  clean_up(){
    this.user_list = []
  }
}
