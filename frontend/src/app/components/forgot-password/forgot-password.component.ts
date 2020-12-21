import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', Validators.required),
    fullName: new FormControl('', Validators.required),
    securityQuestion: new FormControl('', Validators.required),
    securityAnswer: new FormControl('', Validators.required),
  });
  errorMessage: string;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  checkUser(): void {
    if (this.forgotPasswordForm.get('email').value && this.forgotPasswordForm.get('fullName').value &&
        this.forgotPasswordForm.get('securityQuestion').value && this.forgotPasswordForm.get('securityAnswer').value) {
        this.authService.checkUser(
          this.forgotPasswordForm.get('email').value,
          this.forgotPasswordForm.get('fullName').value,
          this.forgotPasswordForm.get('securityQuestion').value,
          this.forgotPasswordForm.get('securityAnswer').value).subscribe((response) => {
        if (response.status === 200){
          if(response.body && response.body.email && response.body.token && response.body.isAnswerCorrect) {
            this.authService.saveUserDetails(response.body)
            this.router.navigate(['/userConfirm'])
          } else {
            this.errorMessage = 'You have entered incorrect values. Try Again.'
          }
        }
      }, error => {
        console.error(error);
        this.errorMessage = error.error.message;
      })
    }
  }

  clearError(): void {
    this.errorMessage = '';
  }

}
