import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  host:{
    class: 'sidebar-col',
    id: 'sidebar-col'
  }
})
export class SidebarMenuComponent implements OnInit {

 
  @HostBinding('class.minimized') isMinimized = true;
  @Output() sidebarToggled = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // Method to check if the current route is active
  isActive(url: string): boolean {
    return this.router.url.includes(url);
  }

  toggleCollapse(){
    this.isMinimized = !this.isMinimized;
    this.sidebarToggled.emit(this.isMinimized);

    //for closing collapse inbox if sidebar minimise while collapse is open
    const collapseInbox= document.getElementById('collapseInbox');
    if (collapseInbox) {
      collapseInbox.classList.remove('show');
    }
    const collapseBtn= document.getElementById('collapse-btn');
    if (collapseBtn) {
      collapseBtn.setAttribute('aria-expanded', 'false');
    }
  }


}
