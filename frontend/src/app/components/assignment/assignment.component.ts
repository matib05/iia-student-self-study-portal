import { Component, OnInit } from '@angular/core';
import {AssignmentService} from "../../services/assignment.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import * as moment from 'moment';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {
  assignments: any;
  overallGrade: any;
  errorMessage: string;
  today: string = moment().toISOString();
  constructor(private assignmentService: AssignmentService, private router: Router, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.assignmentService.getAllAssignment().subscribe(response => {
      if (response.status === 200){
        if(response.body && response.body.token && response.body.assignments) {
          this.authService.saveToken(response.body.token)
          this.assignments = response.body.assignments;
          if (response.body.overallGrade) {
            this.overallGrade = response.body.overallGrade;
          }
        }
      }
    }, error => {
      console.error(error);
      this.errorMessage = error.error.message;
    })
  }

  takeAssessment(id: string): void {
    this.router.navigate([`/assignment/${id}`]);
  }

  showAssessmentAnswers(id: string): void{
    this.router.navigate([`/assignment/${id}`]);
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  compareDates(id) {
    const assignment = this.assignments.filter(assignment => assignment._id == id);
    console.log(assignment[0].date);
    console.log(this.today);
    console.log('done');
    return (assignment[0].date >= this.today)
  }

}
