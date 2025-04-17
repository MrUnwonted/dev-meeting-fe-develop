import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoginComponent } from 'src/app/login/login.component';
import { ServiceService } from 'src/app/services/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wf-checklist',
  templateUrl: './wf-checklist.component.html',
  styleUrl: './wf-checklist.component.scss'
})
export class WfChecklistComponent {

  bilingual: boolean = environment.bilingual;
  language: any = 'en';
   @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns_en: string[] = ['slNo', 'question', 'yes_ans', 'no_ans', 'edit'];
  displayedColumns_ln: string[] = ['slNo', 'question_ln', 'yes_ans_ln', 'no_ans_ln', 'edit'];

  dataSource: any ;
  question_ar: any = [];
  step_id: any;
  flag: any


  title: any = 'Checklist for - ';

  show_error: Boolean = false;
  msg: any;

  // Form data
  form_data: any = {
    id: null,
    questions: '',
    questions_ln: '',
    yes_ans: '',
    yes_ans_ln: '',
    no_ans: '',
    no_ans_ln: '',
    order_id: ''
  };

  selected_child: any;

  modalButtons = [
    { text: 'Cancel', className: 'btn btn-outline-primary-90 xs', action: this.closeModal.bind(this) },
    { text: 'Save', className: 'btn btn-primary-90 xs', action: this.save.bind(this) },
  ];

  constructor(private dialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonsvr: ServiceService

  ) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    console.log("testing ");
    
    if (this.data) {
      console.log(this.data);
      this.title += "(" + this.data.stage + " - " + this.data.step_name + ")";
      this.step_id = this.data.step_id;
      this.flag = this.data.flag

      console.log( this.flag +" testing the flag is working ");

      console.log( this.step_id +" step_id the flag is working ");
      
      if (this.step_id > 0) {
        this.fetch_checklist();
      }
    }
    console.log("testing");
    

  }

  closeModal(): void {
    this.dialogRef.close({});
  }

  add_question() {
    if (!this.validate_formdata()) {
      return;
    }
    if (this.selected_child!=null) {
      this.question_ar[this.selected_child] = this.form_data;
    } else {
      this.form_data.order_id = this.question_ar.length + 1;
      this.question_ar.push(this.form_data);
    }
    this.clear_form();
    this.dataSource = new MatTableDataSource(this.question_ar);
    console.log(this.question_ar);

  }

  clear_error_flg() {
    this.show_error = false;
    this.msg = '';
  }

  validate_formdata() {
    if (this.form_data.questions == '' || this.form_data.questions.trim().length === 0) {
      this.show_error = true;
      this.msg = "Enter Question !!"
      return false;
    } else if ((this.form_data.questions_ln == '' && this.bilingual) || (this.form_data.questions_ln?.trim().length === 0 && this.bilingual)) {
      this.show_error = true;
      this.msg = "Enter Question(മലയാളം)!!"
      return false;
    } else if (this.form_data.yes_ans == '' || this.form_data.yes_ans.trim().length === 0) {
      this.show_error = true;
      this.msg = "Enter answer relevant to option-Yes!!"
      return false;
    } else if ((this.form_data.yes_ans_ln == '' && this.bilingual) || (this.form_data.yes_ans_ln?.trim().length === 0 && this.bilingual)) {
      this.show_error = true;
      this.msg = "Enter answer relevant to option-Yes(മലയാളം)!!";
      return false;
    } if (this.form_data.no_ans == '' || this.form_data.no_ans.trim().length === 0) {
      this.show_error = true;
      this.msg = "Enter answer relevant to option-No!!"
      return false;
    } else if ((this.form_data.no_ans_ln == '' && this.bilingual) || (this.form_data.no_ans_ln?.trim().length === 0 && this.bilingual)) {
      this.show_error = true;
      this.msg = "Enter answer relevant to option-No(മലയാളം)!!";
      return false;
    }
    return true;
  }

  row_click(row: any): void {
    console.log(row);
    let index = row.order_id;
    this.form_data = { ...row }; 
 
    this.selected_child= parseInt(row.order_id)-1;
    console.log(this.selected_child);
   // let step = this.question_ar.find((obj: any) => obj.order_id == index);
  }


  clear_form(): void {
    this.form_data = {
      questions: '',
      questions_ln: '',
      yes_ans: '',
      yes_ans_ln: '',
      no_ans: '',
      no_ans_ln: '',
      id: null,
      order_id: ''
    };

    this.selected_child = null
  }

    delete_item(row: any) {
    console.log(row);
    const index = this.question_ar.findIndex((item: any) => item.order_id === row.order_id);
    if (index > -1) {
        this.question_ar.splice(index, 1);
        // Reassign order_id
        this.question_ar.forEach((item: any, idx: number) => {
            item.order_id = idx + 1;
        });
        this.dataSource = new MatTableDataSource(this.question_ar);
    }
}


  save() {
    
  if (this.question_ar.length === 0) {
    this.openCustomSnackbar('error', 'Please add at least one data to save.');
    return;
  }
    console.log(this.question_ar);
    let param = {
      "step_id": this.step_id,
      "child": this.question_ar
    };
    this.commonsvr.postservice('api/v0/save_wf_checklists', param).subscribe((res: any) => {
      console.log(res);
      if (res.msg == 'Success') {
        this.openCustomSnackbar('success', 'Saved Successfully');
      } else {
        this.openCustomSnackbar('error', 'Failed to save');
      }
    });

    this.closeModal();
  }

  fetch_checklist() {
    this.question_ar = [];

    let param = {
      "step_id": this.step_id
    }

    this.commonsvr.postservice('api/v0/get_wf_checklists', param).subscribe((res: any) => {
      console.log(res);
      res.forEach((element: any) => {
        let data = {
          id: element.checklist_id,
          questions: element.qns,
          questions_ln: element.qns_ln,
          yes_ans: element.yes_note,
          yes_ans_ln: element.yes_note_ln,
          no_ans: element.no_note,
          no_ans_ln: element.no_note_ln,
          order_id: element.order_id
        };

        this.question_ar.push(data);
      });

      this.dataSource = new MatTableDataSource(this.question_ar);

    })

  }


  openCustomSnackbar(type: any, msg: any) {
    // this.snackBar.openFromComponent(ToasterComponent, {
    //   data: {
    //     type: type,
    //     message: msg,
    //   },
    //   duration: 2000,
    //   horizontalPosition: 'center',
    //   verticalPosition: 'top',
    //   panelClass: ['custom-toast']
    // });
  }
}
