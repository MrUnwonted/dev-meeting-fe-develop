import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  host:{
    class: 'sidebar-col',
    id: 'sidebar-col'
  }
})
export class AdminSidebarComponent implements OnInit {

  @HostBinding('class.minimized') isMinimized = true;
  @Output() sidebarToggled = new EventEmitter<boolean>();

  currentModule: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
     // Subscribe to router events to track URL changes
     this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateCurrentModule();
      }
    });

    this.updateCurrentModule(); // Initialize module detection on page load
  }

  toggleCollapse(){
    this.isMinimized = !this.isMinimized;
    this.sidebarToggled.emit(this.isMinimized);
  }

  updateCurrentModule(): void {
    const currentUrl = this.router.url;

    // Check if the URL contains 'masters' or 'users' after '/main/admin/'
    if (currentUrl.startsWith('/main/admin/masters')) {
      this.currentModule = 'masters';
    } else if (currentUrl.startsWith('/main/admin/users')) {
      this.currentModule = 'users';
    } else if (currentUrl.startsWith('/main/admin/office')) {
      this.currentModule = 'office';
    } else if (currentUrl.startsWith('/main/admin/workflow')) {
      this.currentModule = 'workflow';
    } else {
      this.currentModule = ''; // Handle other cases or leave blank
    }
  }


  // sidebar item active
  isActive(route: string): boolean {
    return this.router.url === route;
  }


}
