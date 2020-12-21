import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  errorMessage: string
  constructor(public authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()) {
      this.router.navigate(['/assignments']);
    }
  }

  login(): void {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe((response) => {
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

  clearError(): void {
    this.errorMessage = '';
  }

}
