import { Component, OnInit } from '@angular/core';
import {AssignmentService} from "../../services/assignment.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {
  assignments: any;
  overallGrade: any;
  errorMessage: string;
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

}
