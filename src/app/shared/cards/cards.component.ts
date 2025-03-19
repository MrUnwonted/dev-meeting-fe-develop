import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

 
  private _cardClass: string | undefined;
  
  @Input() set cardClass(value: string) {
    this._cardClass = value;
  }

  @HostBinding('class') get hostClass() {
    return this._cardClass;
  }


  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }
  

}
