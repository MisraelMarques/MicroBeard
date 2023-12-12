import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {NgbModal,NgbActiveModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Scheduling } from 'src/app/interfaces/scheduling/scheduling.model';
import { SchedulingRepositoryService } from '../../services/repositories/scheduling-repository.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { IQueryString } from 'src/app/interfaces/query-string/query-string';
import { SchedulingSearch } from 'src/app/interfaces/scheduling/scheduling-search';
import { SchedulingOrder } from 'src/app/interfaces/scheduling/scheduling-order';
import { Order } from 'src/app/enums/order-enum';
import { QueryStringHelper } from '../../helpers/query-string-helper';
import { IPagination } from 'src/app/interfaces/query-string/pagination';
import { ISearchType } from 'src/app/interfaces/query-string/search';

@Component({
  selector: 'app-scheduling-delete-modal',
  templateUrl: './scheduling-delete-modal.component.html',
  styleUrls: ['./scheduling-delete-modal.component.css']
})
export class SchedulingDeleteModalComponent implements OnInit {
  schedulings: Scheduling[];
  errorMessage: string = '';
  closeResult = '';

  queryString: IQueryString<SchedulingSearch, SchedulingOrder> = {
    Search: {
      Code: {
        SearchValue: null,
        DisplayValue: "Código",
        ValueType: ISearchType.number,
      },
      ServiceCode: {
        SearchValue: null,
        DisplayValue: "Código do Serviço",
        ValueType: ISearchType.number,
      },
      CollaboratorCode: {
        SearchValue: null,
        DisplayValue: "Código do Colaborador",
        ValueType: ISearchType.number,
      },
      LicenseCode: {
        SearchValue: null,
        DisplayValue: "Código da Habilitação",
        ValueType: ISearchType.number,
      },
      ContactCode: {
        SearchValue: null,
        DisplayValue: "Código do Cliente",
        ValueType: ISearchType.number,
      },
      DateDay: {
        SearchValue: null,
        DisplayValue: "Dia",
        ValueType: ISearchType.number,
      },
      DateMonth: {
        SearchValue: null,
        DisplayValue: "Mês",
        ValueType: ISearchType.number,
      },
      DateYear: {
        SearchValue: null,
        DisplayValue: "Ano",
        ValueType: ISearchType.number,
      },
    },
    Ordination: {
      Code: {
        Order: Order.none,
        OrderName: 'Code'
      },
      ServiceCode: {
          Order: Order.none,
          OrderName: 'ServiceCode'
      },
      CollaboratorCode: {
          Order: Order.none,
          OrderName: 'CollaboratorCode'
      },
      LicenseCode: {
          Order: Order.none,
          OrderName: 'LicenseCode'
      },
      ContactCode: {
          Order: Order.none,
          OrderName: 'ContactCode'
      },
      DateDay: {
          Order: Order.none,
          OrderName: 'DateDay'
      },
      DateMonth: {
          Order: Order.none,
          OrderName: 'DateMonth'
      },
      DateYear: {
          Order: Order.none,
          OrderName: 'DateYear'
      }
    },
    Pagination: {
      TotalCount: null,
      CurrentPage: 1,
      PageSize: 100,
      TotalPages: null,
      HasNext: null,
      HasPrevious: null
    }
  }

  constructor(private modalService: NgbModal,
              private repository: SchedulingRepositoryService,
               private errorHandler: ErrorHandlerService,
               private queryStringService: QueryStringHelper<SchedulingSearch, SchedulingOrder>,
                private router: Router,
                private bsModalRef: BsModalRef,
                public activeModal: NgbActiveModal) { }
  
  ngOnInit(): void {
    this.getAllSchedulings();
  }

  protected getAllSchedulings = () => {
    const apiDeleteress: string = 'Scheduling' + this.queryStringService.writeQueryStrings(this.queryString);
    this.repository.getSchedulings(apiDeleteress)
    .subscribe({
      next: (response: HttpResponse<Scheduling[]>) => {
        this.schedulings = response.body
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

  public redirectToSchedulingUpdate = (scheduling:Scheduling) => {
    this.router.navigate([]).then(result => {  window.open( `/scheduling/update/${scheduling.code}`, '_blank'); });
  }

  public forceDeleteCollaborator = () => {

  }
}
