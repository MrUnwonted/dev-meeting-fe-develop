import { Component, Input, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
  host:{
    class: 'topbar'
  }
})
export class HeaderMenuComponent implements OnInit {

 
  languages:any =[];
  currentLang:any;
  lan:any;
  langid:any;
  @Input() showModuleLogo: boolean = true; // Receive the logo visibility flag

  user_name:any;
  designation:any;
  user_email:any;
  user_mobile:any;
  office_name: any;
  office_name_ln:any;
  seat_name:any;
  seat_name_ln:any;
  seat_code:any;

  constructor(
    private sessionSvr:SessionService,

   ) { 

    // translate.addLangs(['en', 'ln']);
    // translate.setDefaultLang('en');
  }

  ngOnInit(): void {

    // this.languages = [
    //   {
    //     id: 1,
    //     name: 'English',
    //     icon: '../../../assets/public/image/png/ind.png',
    //   },
    //   {
    //     id: 2,
    //     name: 'Malayalam',
    //     icon: '../../../assets/public/image/png/ind.png',
    //   },
    // ];

    // this.currentLang = this.languages[0]; // Default to English

    this.languages = [
      { id: 1, name: "English", icon: '../../../assets/public/image/png/ind.png' },
      { id: 2, name: environment.lang, icon: '../../../assets/public/image/png/ind.png', } // Assuming environment.lang has the second language
    ];
    // Get language from local storage or set default to English ('en')
    this.lan = localStorage.getItem("lang") ? localStorage.getItem("lang") : 'en';

    // Set the langid based on localStorage value
    switch (this.lan) {
      case 'ln':
        this.langid = 2;  // Assuming 'ln' is the code for the environment language
        this.currentLang = this.languages[1];
        break;
      default:
        this.langid = 1;  // Default to English
        this.currentLang = this.languages[0]; // Set currentLang to English
        break;
    }

   // this.translate.use(this.lan);
    console.log(this.lan);

    this.user_name = this.sessionSvr.user_name ;
    this.designation = this.sessionSvr.designation ;
    this.user_email = this.sessionSvr.email ;
    this.user_mobile = this.sessionSvr.mobile ;
    this.office_name =  this.sessionSvr.office_name + '('+ this.sessionSvr.office_code +')';
    this.office_name_ln = this.sessionSvr.office_name_ln+ '('+ this.sessionSvr.office_code +')';;
    this.seat_name= this.sessionSvr.seat_name+ '('+ this.sessionSvr.seat_code +')';;
    this.seat_name_ln = this.sessionSvr.seat_name_ln+ '('+ this.sessionSvr.seat_code +')';
    this.seat_code = this.sessionSvr.seat_code ;
  }




  switchLanguage(lang: any) {
    this.currentLang = lang;
    let cur_lan;

    // Check the selected language and set the appropriate language code
    if (lang.name === environment.lang) {
      cur_lan = 'ln';  // Assuming 'ln' is the code for the second language
    } else {
      cur_lan = 'en';  // Default to English
    }

    // Store the selected language in localStorage
    localStorage.setItem("lang", cur_lan);

    // Update the translation service to use the selected language
   // this.translate.use(cur_lan);

    // Update the current language and langid
    this.currentLang = lang;  // This will change the displayed name in the dropdown
    this.langid = lang.id;    // Update the selected language ID
  }

  
  logout(event:Event){
    event.preventDefault();
    localStorage.removeItem("token")
    sessionStorage.removeItem("tocken")   
    window.location.href = `${environment.ssoUrl}`;
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
