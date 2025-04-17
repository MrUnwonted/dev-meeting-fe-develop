import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from '../shared/layout/admin/admin.component';
import { CreateMeetingsComponent } from '../create-meetings/create-meetings.component';
import { WfChecklistComponent } from './wf-checklist/wf-checklist.component';
import { SubjectWfStepsComponent } from './subject-wf-steps/subject-wf-steps.component';

const routes: Routes = [
    {
        path: "",
        component: AdminComponent,
        children:[
          {
            path: "meetings",
            component: CreateMeetingsComponent
          },
          {path:"wf-checklist",
            component : WfChecklistComponent
          },
          {path:"wf-steps",
            component : SubjectWfStepsComponent
          }
        ]
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
