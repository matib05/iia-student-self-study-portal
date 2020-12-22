import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/User";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) { }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token)
  }

  public login(email, password): Observable<HttpResponse<any>> {
    return this.http.post<any>(`/api/user/login`, {email, password}, {observe: 'response'})
  }

  public signUp(email, fullName, password, securityQuestion, securityAnswer): Observable<HttpResponse<any>> {
    return this.http.post<any>(`/api/user/register`,
      {email: email,
        name: fullName,
        password: password,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer
      }, {observe: 'response'});
  }

  public checkUser(email, name, securityQuestion, securityAnswer): Observable<HttpResponse<any>> {
    return this.http.post<any>(`/api/user/checkUser`,
      {email, name, securityQuestion, securityAnswer}, {observe: 'response'});
  }

  public changePassword(password): Observable<HttpResponse<any>> {
    return this.http.post<any>(`/api/user/changePassword`, {password}, {observe: "response"});
  }

  public saveUserDetails(userObject: User): void {
    localStorage.setItem('email', userObject.email);
    localStorage.setItem('token', userObject.token);
  }

  public saveEmail(email: string): void {
    localStorage.setItem('email', email);
  }

  public saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public getToken(): String {
    return localStorage.getItem('token');
  }

  public getEmail(): string {
    return localStorage.getItem('email');
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }
}
