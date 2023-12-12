import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Service } from 'src/app/interfaces/service/service.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceRepositoryService } from 'src/app/shared/services/repositories/service-repository.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent implements OnInit {
  service: Service;
  errorMessage: string = '';
  role: string;

  constructor(private repository: ServiceRepositoryService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getServiceDetails()
    this.role = localStorage.getItem('userRole');
  }

  getServiceDetails = () => {
    const code: string = this.activeRoute.snapshot.params['code'];
    const apiUrl: string = `Service/${code}`;

    this.repository.getService(apiUrl)
    .subscribe({
      next: (colab: Service) => this.service = colab,
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

  redirectToServiceList = () => {
    this.router.navigate(['/service/list']);
  }

  public redirectToUpdatePage = (code) => { 
    const updateUrl: string = `/service/update/${code}`; 
    this.router.navigate([updateUrl]); 
  }
}
