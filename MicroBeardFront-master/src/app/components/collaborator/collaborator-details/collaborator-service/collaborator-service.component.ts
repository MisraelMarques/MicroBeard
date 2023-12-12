import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Service } from 'src/app/interfaces/service/service.model';
import { Router } from '@angular/router';
import { License } from 'src/app/interfaces/license/license.model';

@Component({
  selector: 'app-collaborator-service',
  templateUrl: './collaborator-service.component.html',
  styleUrls: ['./collaborator-service.component.css']
})
export class CollaboratorServiceComponent implements OnInit {
  @Input() licenses: License[];
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onServiceClicked = (service: Service) => {
    const detailsUrl: string = `/service/details/${service.code}`;
    this.router.navigate([detailsUrl]);
  }
}
