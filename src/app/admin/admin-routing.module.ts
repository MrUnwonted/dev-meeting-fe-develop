import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from '../shared/layout/admin/admin.component';
import { CreateMeetingsComponent } from '../create-meetings/create-meetings.component';

const routes: Routes = [
    {
        path: "",
        component: AdminComponent,
        children:[
          {
            path: "meetings",
            component: CreateMeetingsComponent
          },
        ]
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
