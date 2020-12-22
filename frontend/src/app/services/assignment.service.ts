import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  url = environment.baseUrl;

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  public getAllAssignment(): Observable<HttpResponse<any>> {
    return this.http.get(`${this.url}/assignments`, {observe: 'response'});
  }

  public getAssignmentDetails(id: string): Observable<HttpResponse<any>> {
    return this.http.get(`${this.url}/assignments/${id}`, {observe: 'response'});
  }

  public submitAssignment(userAnswers: object, assignmentId: string): Observable<HttpResponse<any>> {
    return this.http.post(`${this.url}/assignments/${assignmentId}`, {userAnswers}, {observe: 'response'})
  }

}
