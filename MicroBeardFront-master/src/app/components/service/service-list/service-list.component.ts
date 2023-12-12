import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from 'src/app/interfaces/service/service.model';
import { ServiceRepositoryService } from 'src/app/shared/services/repositories/service-repository.service';

import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ServiceSearch } from 'src/app/interfaces/service/service-search';
import { ServiceOrder } from 'src/app/interfaces/service/service-order';
import { Order } from 'src/app/enums/order-enum';
import { IQueryString } from 'src/app/interfaces/query-string/query-string';
import { QueryStringHelper } from 'src/app/shared/helpers/query-string-helper';
import { IPagination } from 'src/app/interfaces/query-string/pagination';
import { ISearchType } from 'src/app/interfaces/query-string/search';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  services: Service[];
  errorMessage: string = '';
  role: string;

  queryString: IQueryString<ServiceSearch, ServiceOrder> = {
    Search: {
      Code: {
        SearchValue: null,
        DisplayValue: "Código",
        ValueType: ISearchType.number,
      },
      Name: {
        SearchValue: null,
        DisplayValue: "Nome",
        ValueType: ISearchType.string,
      },
      CollaboratorCode: {
        SearchValue: null,
        DisplayValue: "Código do Colaborador",
        ValueType: ISearchType.number,
      },
    },
    Ordination: {
      Code: {
        Order: Order.asc,
        OrderName: 'Code'
      },
      Name: {
        Order: Order.none,
        OrderName: 'Name'
      },
      Price: {
        Order: Order.none,
        OrderName: 'Price'
      },
      CollaboratorCode: {
        Order: Order.none,
        OrderName: 'CollaboratorCode'
      }
    },
    Pagination: {
      TotalCount: null,
      CurrentPage: 1,
      PageSize: 10,
      TotalPages: null,
      HasNext: null,
      HasPrevious: null
    }
  }

  constructor(private repository: ServiceRepositoryService,
               private errorHandler: ErrorHandlerService,
               private queryStringService: QueryStringHelper<ServiceSearch, ServiceOrder>,
                private router: Router) { }

  ngOnInit(): void {
    this.getAllServices();
    this.role = localStorage.getItem('userRole');
  }

  protected getAllServices = () => {
    const apiAddress: string = 'Service' + this.queryStringService.writeQueryStrings(this.queryString);
    this.repository.getServices(apiAddress)
    .subscribe({
      next: (response: HttpResponse<Service[]>) =>{
        this.services = response.body,
        this.queryString.Pagination = JSON.parse(response.headers.get('X-Pagination')) as IPagination
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

  public updateOrdination = (ordination: string) =>{
    this.queryString = this.queryStringService.updateQueryStringOrdination(ordination, this.queryString) as IQueryString<ServiceSearch, ServiceOrder>
    this.getAllServices();
  }

  private getServiceDetails = (code) =>{
    const detailsUrl: string = `/service/details/${code}`;
    this.router.navigate([detailsUrl]);
  }

  public redirectToUpdatePage = (code) => { 
    const updateUrl: string = `/service/update/${code}`; 
    this.router.navigate([updateUrl]); 
  }

  public redirectToDeletePage = (code) => {
    const deleteUrl: string = `/service/delete/${code}`;
    this.router.navigate([deleteUrl])
  }
}
