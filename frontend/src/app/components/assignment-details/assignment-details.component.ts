import {Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AssignmentService} from "../../services/assignment.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";


@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.css']
})
export class AssignmentDetailsComponent implements OnInit{
  activatedRouteSub: any;
  errorMessage: string;
  assignmentId: string;
  assignment: any;
  assignmentForm: any;
  fields: object = {};
  userAnswers: Array<{questionId: string, userAnswer: string}> = [];
  constructor(private route: ActivatedRoute, private router: Router, private assignmentService: AssignmentService,
              private fb: FormBuilder, private authService: AuthenticationService) {

  }

  ngOnInit(): void {
    this.activatedRouteSub = this.route.params.subscribe(params => {
      this.assignmentId = params.id
      if (!this.assignmentId) {
        this.router.navigate(['/']);
        return;
      }

      this.assignmentService.getAssignmentDetails(this.assignmentId).subscribe(response => {
        this.assignment = response;
        if (response.status === 200){
          if(response.body && response.body.token && response.body.assignment) {
            this.authService.saveToken(response.body.token)
            this.assignment = response.body.assignment;
            this.assignment.questions.forEach(question => {
              this.fields[`${question._id}`] = this.fb.control([''], Validators.required)
            })
            this.assignmentForm = this.fb.group(this.fields);
          }
        }
      }, error => {
        console.error(error);
        this.errorMessage = error.error.message;
      })
    })
  }


  onSubmit(userAnswers): void {

    this.assignment.questions.forEach(question => {
      this.userAnswers.push({questionId: question._id, userAnswer: userAnswers.controls[`${question._id}`].value})
    })

    this.assignmentService.submitAssignment(this.userAnswers, this.assignmentId).subscribe(response => {
      if (response.status === 200) {
        this.router.navigate(['/assignments'])
      }
    })
  }

}
