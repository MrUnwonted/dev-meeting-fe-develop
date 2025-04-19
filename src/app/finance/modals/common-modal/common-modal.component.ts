import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-modal',  
  templateUrl: './common-modal.component.html',
  styleUrl: './common-modal.component.scss'
})
export class  CommonModalComponent {
  @Input() title: string = '';

  @Input() imageSrc: string = ''; 
  @Input() imageAlt: string = ''; 
  
  @Input() buttons: { text: string, className: string,  icon?: string, action: (() => void) | string; }[] = [];  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
  }

  handleButtonClick(action: (() => void) | string) {
    if (typeof action === 'function') {
      action(); // Call the function
    } else if (typeof action === 'string') {
      // Handle the string case (e.g., navigate to a URL)
      window.location.href = action;
    }
  }

  closeDialog(): void {
    // Send data back to the parent component
    this.dialogRef.close({ result: 'Data from dialog', "data": this.data });
    
  }


}
