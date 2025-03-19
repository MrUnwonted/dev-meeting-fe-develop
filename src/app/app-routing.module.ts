import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CreateMeetingsComponent } from './create-meetings/create-meetings.component';

const routes: Routes = [

  {
    path: "",
    component: HomeComponent
  },

  {
    path: "login",
    component: LoginComponent
  },
  
  {
    path: "main",
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  {
    path: "meetings",
    component: CreateMeetingsComponent
  },

  {
    path: "finance",
    loadChildren: () => import('./finance/finance.module').then(m => m.FinanceModule)
  },
  {
    path: "admin",
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
