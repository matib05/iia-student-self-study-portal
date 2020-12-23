import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import {AssignmentComponent} from "./components/assignment/assignment.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {AssignmentDetailsComponent} from "./components/assignment-details/assignment-details.component";
import {SignupComponent} from "./components/signup/signup.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {UserConfirmComponent} from "./components/forgot-password/user-confirm/user-confirm.component";
import {AdminPanelComponent} from "./components/admin-panel/admin-panel.component";
import {CreateAssignmentComponent} from "./components/admin-panel/create-assignment/create-assignment.component";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'userConfirm', component: UserConfirmComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'assignments', component: AssignmentComponent, canActivate: [AuthGuardService] },
  { path: 'assignment/:id', component: AssignmentDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuardService] },
  { path: 'createAssignment', component: CreateAssignmentComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
