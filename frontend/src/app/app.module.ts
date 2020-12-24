import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { JwtModule } from "@auth0/angular-jwt";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { AssignmentComponent } from './components/assignment/assignment.component';
import { JwtHelperService, JWT_OPTIONS} from "@auth0/angular-jwt";
import { AssignmentDetailsComponent } from './components/assignment-details/assignment-details.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from "./interceptors/token.interceptor";
import { FooterComponent } from './components/footer/footer.component';
import { SignupComponent } from './components/signup/signup.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { UserConfirmComponent } from './components/forgot-password/user-confirm/user-confirm.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CreateAssignmentComponent } from './components/admin-panel/create-assignment/create-assignment.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    AssignmentComponent,
    AssignmentDetailsComponent,
    FooterComponent,
    SignupComponent,
    ForgotPasswordComponent,
    UserConfirmComponent,
    AdminPanelComponent,
    CreateAssignmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    JwtModule,
    NoopAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
