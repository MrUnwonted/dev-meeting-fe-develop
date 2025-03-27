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
import { BanksComponent } from './banks/banks.component';
import {MatTabsModule} from '@angular/material/tabs';
import { SearchOfficeComponent } from './modals/search-office/search-office.component';


@NgModule({
  declarations: [
    CreateAccountHeadsComponent,
    SearchSecondaryHeadsComponent,
    CommonModalComponent,
    BanksComponent,
    SearchOfficeComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    MatTabsModule    
  ]
})
export class FinanceModule { }
