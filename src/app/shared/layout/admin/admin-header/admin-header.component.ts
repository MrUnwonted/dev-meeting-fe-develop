import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
  host:{
    class: 'topbar'
  }
})
export class AdminHeaderComponent implements OnInit {

  languages = [
    {
      id: 1,
      name: 'English (IN)',
      icon: '../../../assets/public/image/png/ind.png',
    },
    {
      id: 2,
      name: 'Malayalam',
      icon: '../../../assets/public/image/png/ind.png',
    },
  ];

  currentLang = this.languages[0]; // Default to English

  switchLanguage(lang: any) {
    this.currentLang = lang;
    // Additional logic for changing language (e.g., loading translations) can be added here
  }
  @Input() showModuleLogo: boolean = true; // Receive the logo visibility flag
  
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openSwitchSeatsModal() {
   

    // var dialogRef = this.dialog.open(SwitchSeatsModalComponent, {
    //   width: "480px",
    //   data:{"moduleId":45} ,
    // })
    // dialogRef?.afterClosed().subscribe((data: any) => {
    //   console.log(data)
    // });
  }


}
