import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Collaborator } from 'src/app/interfaces/collaborator/collaborator.model';
import { CollaboratorRepositoryService } from '../../services/repositories/collaborator-repository.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { IQueryString } from 'src/app/interfaces/query-string/query-string';
import { CollaboratorSearch } from 'src/app/interfaces/collaborator/collaborator-search';
import { CollaboratorOrder } from 'src/app/interfaces/collaborator/collaborator-order';
import { Order } from 'src/app/enums/order-enum';
import { QueryStringHelper } from '../../helpers/query-string-helper';
import { IPagination } from 'src/app/interfaces/query-string/pagination';
import { ISearchType } from 'src/app/interfaces/query-string/search';

@Component({
  selector: 'app-collaborator-add-modal',
  templateUrl: './collaborator-add-modal.component.html',
  styleUrls: ['./collaborator-add-modal.component.css']
})
export class CollaboratorAddModalComponent implements OnInit {

  @Output() returnEntry: EventEmitter<any> = new EventEmitter();
  collaborators: Collaborator[];
  errorMessage: string = '';
  closeResult = '';

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

  constructor(private modalService: NgbModal,
              private repository: CollaboratorRepositoryService,
               private errorHandler: ErrorHandlerService,
               private queryStringService: QueryStringHelper<CollaboratorSearch, CollaboratorOrder>,
                private router: Router,
                private bsModalRef: BsModalRef) { }
  
  ngOnInit(): void {
    this.getAllCollaborators();
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

  close = () => {
    this.modalService.dismissAll();
  }

  public returnCollaborator = (collaborator:Collaborator) => {
    this.returnEntry.emit(collaborator);
  }

}
