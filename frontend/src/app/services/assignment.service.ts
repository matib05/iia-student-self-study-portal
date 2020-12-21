import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  url = 'http://localhost:5000'

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
