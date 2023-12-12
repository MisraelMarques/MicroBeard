import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Collaborator } from 'src/app/interfaces/collaborator/collaborator.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scheduling-collaborator',
  templateUrl: './scheduling-collaborator.component.html',
  styleUrls: ['./scheduling-collaborator.component.css']
})
export class SchedulingCollaboratorComponent implements OnInit {

  @Input() collaborator: Collaborator;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onCollaboratorClicked = (collaborator: Collaborator) => {
    const detailsUrl: string = `/collaborator/details/${collaborator.code}`;
    this.router.navigate([detailsUrl]);
  }
}
