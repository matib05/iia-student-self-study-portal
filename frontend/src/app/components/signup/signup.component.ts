import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm = new FormGroup({
    email: new FormControl('', Validators.required),
    fullName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    securityQuestion: new FormControl('', Validators.required),
    securityAnswer: new FormControl('', Validators.required),
  });
  errorMessage: string
  constructor(public authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {

  }

  signup(): void {
    if (this.signupForm.get('email').value && this.signupForm.get('fullName').value &&
      this.signupForm.get('password').value && this.signupForm.get('confirmPassword').value &&
      this.signupForm.get('securityQuestion').value && this.signupForm.get('securityAnswer').value) {
      if (this.signupForm.get('password').value === this.signupForm.get('confirmPassword').value) {
        this.authService.signUp(
          this.signupForm.get('email').value,
          this.signupForm.get('fullName').value,
          this.signupForm.get('password').value,
          this.signupForm.get('securityQuestion').value,
          this.signupForm.get('securityAnswer').value).subscribe((response) => {
          if (response.status === 200){
            if(response.body && response.body.token && response.body.email) {
              this.authService.saveUserDetails(response.body)
              this.router.navigate(['/assignments'])
            }
          }
        }, error => {
          console.error(error);
          this.errorMessage = error.error.message;
        })
      }
    }
  }

  clearError(): void {
    this.errorMessage = '';
  }

}
