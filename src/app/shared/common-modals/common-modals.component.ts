import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-modals',
  templateUrl: './common-modals.component.html',
  styleUrls: ['./common-modals.component.scss']
})
export class CommonModalsComponent implements OnInit {

  
  selected_action:any;
  @Input() title: string = '';
  @Input() buttons: { text: string, className: string,  icon?: string, action: (() => void) | string; }[] = [];  
  constructor(
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
    this.selected_action = null;

  }

  handleButtonClick(action: (() => void) | string,e:any) {
     this.selected_action = e;
    if (typeof action === 'function') {
      console.log(e);
   
      
      action(); // Call the function
    } else if (typeof action === 'string') {
      // Handle the string case (e.g., navigate to a URL)
      window.location.href = action;
    }
  }

  closeDialog(): void {
    // Send data back to the parent component
    this.dialogRef.close({ result: 'Data from dialog', "data": this.data , "action": this.selected_action });
    
  }

  closeModal():void{
    this.dialogRef.close({ result: 'Data from dialog', "data": this.data , "action": this.selected_action });

  }

}
