import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.router.url);
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/'])
  }

  public get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
