import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {

  
 // Statusmenu
 showStatusMenu= true;

 // module logo
 showModuleLogo = true;
  
 constructor(private router: Router) { 
  this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(() => {

      const currentUrl = this.router.url;
      if (currentUrl === '/main/finance/dashboard') {         
        this.showStatusMenu = false;
      } else{

        this.showStatusMenu = true;
      }
    });

}
 
   ngOnInit(): void {
   }
 
   isSidebarMinimized = true;
 
   onSidebarToggled(minimized: boolean) {
     this.isSidebarMinimized = minimized;
   }


}
