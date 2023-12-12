import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scheduling } from 'src/app/interfaces/scheduling/scheduling.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-scheduling',
  templateUrl: './contact-scheduling.component.html',
  styleUrls: ['./contact-scheduling.component.css']
})
export class ContactSchedulingComponent implements OnInit {
  @Input() schedulings: Scheduling[];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSchedulingClicked = (scheduling: Scheduling) => {
    const detailsUrl: string = `/scheduling/details/${scheduling.code}`;
    this.router.navigate([detailsUrl]);
  }
}
