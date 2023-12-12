import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {
  errorMessage: string = "401 Acesso não autorizado"
  constructor() { }

  ngOnInit(): void {
  }

}
