import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Collaborator } from 'src/app/interfaces/collaborator/collaborator.model';
import { CollaboratorRepositoryService } from 'src/app/shared/services/repositories/collaborator-repository.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Order } from 'src/app/enums/order-enum';
import { CollaboratorOrder } from 'src/app/interfaces/collaborator/collaborator-order';
import { CollaboratorSearch } from 'src/app/interfaces/collaborator/collaborator-search';
import { IQueryString } from 'src/app/interfaces/query-string/query-string';
import { QueryStringHelper } from 'src/app/shared/helpers/query-string-helper';
import { IPagination } from 'src/app/interfaces/query-string/pagination';
import { ISearchType } from 'src/app/interfaces/query-string/search';

@Component({
  selector: 'app-collaborator-list',
  templateUrl: './collaborator-list.component.html',
  styleUrls: ['./collaborator-list.component.css']
})
export class CollaboratorListComponent implements OnInit {
  collaborators: Collaborator[];
  errorMessage: string = '';
  role: string;

  queryString: IQueryString<CollaboratorSearch, CollaboratorOrder> = {
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
      Email: {
        SearchValue: null,
        DisplayValue: "Email",
        ValueType: ISearchType.string,
      },
      Cpf: {
        SearchValue: null,
        DisplayValue: "Cpf",
        ValueType: ISearchType.string,
      },
      ServiceCode: {
        SearchValue: null,
        DisplayValue: "Código do serviço",
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
      Email: {
        Order: Order.none,
        OrderName: 'Email'
      },
      Cpf: {
        Order: Order.none,
        OrderName: 'Cpf'
      },
      ServiceCode: {
        Order: Order.none,
        OrderName: 'ServiceCode'
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

  constructor(private repository: CollaboratorRepositoryService,
               private errorHandler: ErrorHandlerService,
                private queryStringService: QueryStringHelper<CollaboratorSearch, CollaboratorOrder>,
                private router: Router) { }

  ngOnInit(): void {
    this.getAllCollaborators();
    this.role = localStorage.getItem('userRole');
  }

  protected getAllCollaborators = () => {
    const apiAddress: string = 'Collaborator' + this.queryStringService.writeQueryStrings(this.queryString);
    this.repository.getCollaborators(apiAddress)
    .subscribe({
      next: (response: HttpResponse<Collaborator[]>) => {
        this.collaborators = response.body
        this.queryString.Pagination = JSON.parse(response.headers.get('X-Pagination')) as IPagination
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      },
    })
  }

  public updateOrdination = (ordination: string) =>{
    this.queryString = this.queryStringService.updateQueryStringOrdination(ordination, this.queryString) as IQueryString<CollaboratorSearch, CollaboratorOrder>
    this.getAllCollaborators();
  }

  private getCollaboratorDetails = (code) =>{
    const detailsUrl: string = `/collaborator/details/${code}`;
    this.router.navigate([detailsUrl]);
  }

  public redirectToUpdatePage = (code) => { 
    const updateUrl: string = `/collaborator/update/${code}`; 
    this.router.navigate([updateUrl]); 
  }

  public redirectToDeletePage = (code) => {
    const deleteUrl: string = `/collaborator/delete/${code}`;
    this.router.navigate([deleteUrl])
  }
}
