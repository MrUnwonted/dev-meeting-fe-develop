import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-tab-menu',
  templateUrl: './admin-tab-menu.component.html',
  styleUrls: ['./admin-tab-menu.component.scss']
})
export class AdminTabMenuComponent implements OnInit {
  activeTab: string = ''; // Default active tab
  constructor() { }

  ngOnInit(): void {
  }

}
