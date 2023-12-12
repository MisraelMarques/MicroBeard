import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Service } from 'src/app/interfaces/service/service.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scheduling-service',
  templateUrl: './scheduling-service.component.html',
  styleUrls: ['./scheduling-service.component.css']
})
export class SchedulingServiceComponent implements OnInit {

  @Input() service: Service;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onServiceClicked = (service: Service) => {
    const detailsUrl: string = `/service/details/${service.code}`;
    this.router.navigate([detailsUrl]);
  }

}
