import { Component, OnInit } from '@angular/core';
import {AssignmentService} from "../../services/assignment.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private assignmentService: AssignmentService) { }

  ngOnInit(): void {
  }

  get isAssignmentCreated(): boolean {
    return this.assignmentService.isAssignmentCreated;
  }


}
