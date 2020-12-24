import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  url: string = environment.baseUrl

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  public getAllAssignment(): Observable<HttpResponse<any>> {
    return this.http.get(`${this.url}/api/assignments`, {observe: 'response'});
  }

  public getAssignmentDetails(id: string): Observable<HttpResponse<any>> {
    return this.http.get(`${this.url}/api/assignments/${id}`, {observe: 'response'});
  }

  public submitAssignment(userAnswers: object, assignmentId: string): Observable<HttpResponse<any>> {
    return this.http.post(`${this.url}/api/assignments/${assignmentId}`, {userAnswers}, {observe: 'response'})
  }

  public createAssignment(assignment: object): Observable<HttpResponse<any>> {
    return this.http.post(`${this.url}/api/assignments/`, {assignment}, {observe: 'response'});
  }

}
