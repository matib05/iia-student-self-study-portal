import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../services/authentication.service";

@Component({
  selector: 'app-user-confirm',
  templateUrl: './user-confirm.component.html',
  styleUrls: ['./user-confirm.component.css']
})
export class UserConfirmComponent implements OnInit {

  confirmNewPasswordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
  });
  errorMessage: string;
  constructor(private router: Router, private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  createNewPassword(): void {
    let password = this.confirmNewPasswordForm.get('password').value;
    let confirmPassword = this.confirmNewPasswordForm.get('confirmPassword').value;
    if (password === confirmPassword) {

      this.authService.changePassword(password).subscribe(response => {
        if (response.status === 200){
          if(response.body && response.body.token && response.body.email) {
            this.authService.saveUserDetails(response.body)
            this.router.navigate(['/assignments'])
          }
        }
      }, error => {
        console.log('here');
        console.error(error);
        this.errorMessage = error.error.message;
      })
    } else {
      this.errorMessage = 'Passwords do no match';
    }
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
