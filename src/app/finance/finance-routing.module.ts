import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceComponent } from '../shared/layout/finance/finance.component';
import { CreateAccountHeadsComponent } from './create-account-heads/create-account-heads.component';
import { BanksComponent } from './banks/banks.component';

const routes: Routes = [

    {
      path: "",
      component: FinanceComponent,
      children:[
        {
          path: "acc-heads",
          component: CreateAccountHeadsComponent
        },
        {
          path: "banks",
          component: BanksComponent
        },
      ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
