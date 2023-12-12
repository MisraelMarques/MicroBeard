import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contact } from 'src/app/interfaces/contact/contact.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scheduling-contact',
  templateUrl: './scheduling-contact.component.html',
  styleUrls: ['./scheduling-contact.component.css']
})
export class SchedulingContactComponent implements OnInit {
  @Input() contact: Contact;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onContactClicked = (contact: Contact) => {
    const detailsUrl: string = `/contact/details/${contact.code}`;
    this.router.navigate([detailsUrl]);
  }
}
