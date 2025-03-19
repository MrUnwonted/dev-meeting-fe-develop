import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorPageComponent } from './shared/error-page/error-page.component';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthErrorInterceptor } from './auth/auth-error.interceptor';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MainModule } from './main/main.module';
import { CreateMeetingsComponent } from './create-meetings/create-meetings.component';
import { SearchUserComponent } from './search-user/search-user.component';
import { CardsComponent } from './shared/cards/cards.component';
import { CommonModalsComponent } from './shared/common-modals/common-modals.component';
import { FinanceComponent } from './shared/layout/finance/finance.component';
import { HeaderMenuComponent } from './shared/layout/finance/header-menu/header-menu.component';
import { SidebarMenuComponent } from './shared/layout/finance/sidebar-menu/sidebar-menu.component';
import { StatusMenuComponent } from './shared/layout/finance/status-menu/status-menu.component';
import { AdminComponent } from './shared/layout/admin/admin.component';
import { AdminHeaderComponent } from './shared/layout/admin/admin-header/admin-header.component';
import { AdminSidebarComponent } from './shared/layout/admin/admin-sidebar/admin-sidebar.component';
import { AdminTabMenuComponent } from './shared/layout/admin/admin-tab-menu/admin-tab-menu.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');

}

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        HeaderComponent,
        ErrorPageComponent,
        CreateMeetingsComponent,
        SearchUserComponent,
        CardsComponent,
        CommonModalsComponent,
        FinanceComponent,
        HeaderMenuComponent,
        SidebarMenuComponent,
        StatusMenuComponent,
        FinanceComponent,
        AdminComponent,
        AdminHeaderComponent,
        AdminSidebarComponent,
        AdminTabMenuComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        TranslateModule,
        MainModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthErrorInterceptor, multi: true },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
