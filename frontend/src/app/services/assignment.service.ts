import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  public getAllAssignment(): Observable<HttpResponse<any>> {
    return this.http.get('/assignments', {observe: 'response'});
  }

  public getAssignmentDetails(id: string): Observable<HttpResponse<any>> {
    return this.http.get(`/assignments/${id}`, {observe: 'response'});
  }

  public submitAssignment(userAnswers: object, assignmentId: string): Observable<HttpResponse<any>> {
    return this.http.post(`/assignments/${assignmentId}`, {userAnswers}, {observe: 'response'})
  }

}
