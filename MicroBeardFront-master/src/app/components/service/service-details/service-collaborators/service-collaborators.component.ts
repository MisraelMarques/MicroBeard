import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Collaborator } from 'src/app/interfaces/collaborator/collaborator.model';
import { Router } from '@angular/router';
import { License } from 'src/app/interfaces/license/license.model';


@Component({
  selector: 'app-service-collaborators',
  templateUrl: './service-collaborators.component.html',
  styleUrls: ['./service-collaborators.component.css']
})
export class ServiceCollaboratorsComponent implements OnInit {
  @Input() licenses: License[];
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onCollaboratorClicked = (collaborator: Collaborator) => {
    const detailsUrl: string = `/collaborator/details/${collaborator.code}`;
    this.router.navigate([detailsUrl]);
  }
}
