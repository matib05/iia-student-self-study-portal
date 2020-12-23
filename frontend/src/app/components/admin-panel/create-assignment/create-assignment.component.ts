import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.css']
})
export class CreateAssignmentComponent implements OnInit {

  CreateAssignmentForm: FormGroup;

  constructor(private fb: FormBuilder) { }

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

  addChoice(question, index) {
    console.log(index);
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
    console.log(assignmentDetails);
  }

}
