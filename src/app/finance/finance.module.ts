import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { CreateAccountHeadsComponent } from './create-account-heads/create-account-heads.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    CreateAccountHeadsComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
     MatTableModule,
        MatPaginatorModule,
        MatSortModule,
  ]
})
export class FinanceModule { }
