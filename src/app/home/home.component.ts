import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }

 

  open_component() {
   

    var dialogRef = this.dialog.open(LoginComponent, {
      width: "900px",
      data:{"moduleId":1} ,
    })
    dialogRef?.afterClosed().subscribe((data: any) => {
      console.log(data)
    });
}
}
