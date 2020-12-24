import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AssignmentService } from "../../../services/assignment.service";
import { AuthenticationService } from "../../../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.css']
})
export class CreateAssignmentComponent implements OnInit {

  CreateAssignmentForm: FormGroup;
  errorMessage: string;

  constructor(private fb: FormBuilder, private assignmentService: AssignmentService,
              private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.CreateAssignmentForm = this.fb.group({
      dueDate: ['', Validators.required],
      title: ['',Validators.required],
      isActive: ['', Validators.required],
      questions: this.fb.array([this.questions])
    });
  }

  get questions(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      choices: this.fb.array([this.getChoices(0), this.getChoices(1)])
    })
  }

  getChoices(index): FormGroup {
    return this.fb.group({
      [index]: ['', Validators.required],
    })
  }


  addQuestion() {
    (this.CreateAssignmentForm.get('questions') as FormArray).push(this.questions);
  }

  deleteQuestion(questionIndex): void {
    if (questionIndex === 0) {
      alert('Must have at least one question for an assignment');
    } else {
      if (confirm('Are you sure you want to remove this question?')) {
        (this.CreateAssignmentForm.get('questions') as FormArray).removeAt(questionIndex);
      }
    }
  }

  addChoice(question, index) {
    (question.get('choices') as FormArray).push(this.getChoices(index));
  }

  deleteChoice(question, choiceIndex): void {
    if (choiceIndex == 1 || choiceIndex == 0) {
      alert('Must have at least two choices.')
    } else{
      question.get('choices').removeAt(choiceIndex);
    }
  }


  onSubmit(assignmentDetails): void {
    let newAssignment = assignmentDetails.getRawValue()
    if (this.isFormValid(newAssignment)) {
      this.errorMessage = '';
      this.collapseChoicesAndShuffle(newAssignment);
      this.assignmentService.createAssignment(newAssignment).subscribe(response => {
        if (response.body.token) {
          this.authService.saveToken(response.body.token);
        }
        if (response.body.question.isCreated) {
          this.assignmentService.isAssignmentCreated = true;
          this.router.navigate(['/admin'])
        }

      })
    } else {
      this.errorMessage = 'Form invalid: All fields must have values present.';
      window.scroll(0,0);
    }
  }

  private isFormValid(assignmentForm): boolean {
    let isQuestionsValid = true, isChoicesValid = true;
    assignmentForm.questions.forEach(question => {
      if (!question.question || !question.correctAnswer) {
        isQuestionsValid = false;
      }
      question.choices.forEach((choice, i) => {
        if (!choice[i]) {
          isChoicesValid = false;
        }
      })
    })
    return (isChoicesValid && isQuestionsValid && assignmentForm.title && assignmentForm.dueDate && assignmentForm.isActive);
  }

  private collapseChoicesAndShuffle(assignmentForm): object {
    assignmentForm.questions.forEach(question => {
      let choices = [];
      question.choices.forEach((choice, i) => {
        choices.push(choice[i]);
      })
      choices.push(question.correctAnswer);
      question.choices = this.shuffle(choices);

    })
    return this.shuffle(assignmentForm);
  }

  private shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

}
