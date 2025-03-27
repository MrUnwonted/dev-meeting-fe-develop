import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { CreateAccountHeadsComponent } from './create-account-heads/create-account-heads.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SearchSecondaryHeadsComponent } from './modals/search-secondary-heads/search-secondary-heads.component';
import { FormsModule } from '@angular/forms';
import { CommonModalComponent } from './modals/common-modal/common-modal.component';


@NgModule({
  declarations: [
    CreateAccountHeadsComponent,
    SearchSecondaryHeadsComponent,
    CommonModalComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
  ]
})
export class FinanceModule { }
