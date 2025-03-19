import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceComponent } from '../shared/layout/finance/finance.component';
import { CreateAccountHeadsComponent } from './create-account-heads/create-account-heads.component';

const routes: Routes = [

    {
      path: "",
      component: FinanceComponent,
      children:[
        {
          path: "acc-heads",
          component: CreateAccountHeadsComponent
        },
      ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
