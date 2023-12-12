import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Service } from 'src/app/interfaces/service/service.model';
import { ServiceRepositoryService } from '../../services/repositories/service-repository.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IQueryString } from 'src/app/interfaces/query-string/query-string';
import { Order } from 'src/app/enums/order-enum';
import { ServiceSearch } from 'src/app/interfaces/service/service-search';
import { ServiceOrder } from 'src/app/interfaces/service/service-order';
import { QueryStringHelper } from '../../helpers/query-string-helper';
import { IPagination } from 'src/app/interfaces/query-string/pagination';
import { ISearchType } from 'src/app/interfaces/query-string/search';


@Component({
  selector: 'app-service-add-modal',
  templateUrl: './service-add-modal.component.html',
  styleUrls: ['./service-add-modal.component.css']
})
export class ServiceAddModalComponent implements OnInit {

  @Output() returnEntry: EventEmitter<any> = new EventEmitter();
  services: Service[];
  errorMessage: string = '';
  closeResult = '';

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

  constructor(private modalService: NgbModal,
              private repository: ServiceRepositoryService,
               private errorHandler: ErrorHandlerService,
               private queryStringService: QueryStringHelper<ServiceSearch, ServiceOrder>,
                private router: Router,
                private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.getAllServices();
  }

  protected getAllServices = () => {
    const apiAddress: string = 'Service' + this.queryStringService.writeQueryStrings(this.queryString);
    this.repository.getServices(apiAddress)
    .subscribe({
      next: (response: HttpResponse<Service[]>) => {
        this.services = response.body;
        this.queryString.Pagination = JSON.parse(response.headers.get('X-Pagination')) as IPagination
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

  close = () => {
    this.modalService.dismissAll();
  }

  public returnService = (service:Service) => {
    this.returnEntry.emit(service);
  }

}
