import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Scheduling } from 'src/app/interfaces/scheduling/scheduling.model'; 
import { Router, ActivatedRoute } from '@angular/router';
import { SchedulingRepositoryService } from 'src/app/shared/services/repositories/scheduling-repository.service'; 
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { License } from 'src/app/interfaces/license/license.model';

@Component({
  selector: 'app-scheduling-details',
  templateUrl: './scheduling-details.component.html',
  styleUrls: ['./scheduling-details.component.css']
})
export class SchedulingDetailsComponent implements OnInit {

  scheduling: Scheduling;
  errorMessage: string = '';

  constructor(private repository: SchedulingRepositoryService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getSchedulingDetails()
  }

  getSchedulingDetails = () => {
    const code: string = this.activeRoute.snapshot.params['code'];
    const apiUrl: string = `Scheduling/${code}`;

    this.repository.getScheduling(apiUrl)
    .subscribe({
      next: (colab: Scheduling) => this.scheduling = colab,
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  } 

  printToConsole= (param: License) => {
    console.log('Account parameter from the child component', param)
  }

  public redirectToSchedulingList = () => {
    this.router.navigate(['/scheduling/calendar'])
  }

  public redirectToUpdatePage = (code) => { 
    const updateUrl: string = `/scheduling/update/${code}`; 
    this.router.navigate([updateUrl]); 
  }

  public redirectToDeletePage = (code) => {
    const deleteUrl: string = `/scheduling/delete/${code}`;
    this.router.navigate([deleteUrl])
  }
}
