import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-internal-server',
  templateUrl: './internal-server.component.html',
  styleUrls: ['./internal-server.component.css']
})
export class InternalServerComponent implements OnInit {
  errorMessage: string = "500 Ocorreu um erro"
  constructor() { }

  ngOnInit(): void {
  }

}
