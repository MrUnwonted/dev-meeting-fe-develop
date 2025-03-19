import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

 
  // tabs
  showTabsMenu: boolean = true;

  // module logo
  showModuleLogo = true;

  //for  layout change in worklow
  layoutChange: boolean = false;
  
constructor(private router: Router) { 
  this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(() => {

      const currentUrl = this.router.url;
      if (currentUrl === '/main/admin/selection')  {         
        this.showTabsMenu = false;
        this.showModuleLogo = false;
      } 
      else if(currentUrl === '/main/admin/workflow-canvas'){
        this.layoutChange = true;
        this.showTabsMenu = false;
        this.showModuleLogo = true;
      }
      else if(currentUrl === '/main/admin/template'){
        this.layoutChange = true;
        this.showTabsMenu = false;
        this.showModuleLogo = true;
      }
      else{

        this.showTabsMenu = true;
        this.showModuleLogo = true;
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
