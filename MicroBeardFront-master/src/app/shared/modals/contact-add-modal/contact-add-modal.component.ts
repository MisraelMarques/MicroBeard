import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Contact } from 'src/app/interfaces/contact/contact.model';
import { ContactRepositoryService } from '../../services/repositories/contact-repository.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IQueryString } from 'src/app/interfaces/query-string/query-string';
import { QueryStringHelper } from '../../helpers/query-string-helper';
import { ContactSearch } from 'src/app/interfaces/contact/contact-search';
import { ContactOrder } from 'src/app/interfaces/contact/contact-order';
import { Order } from 'src/app/enums/order-enum';
import { IPagination } from 'src/app/interfaces/query-string/pagination';
import { ISearchType } from 'src/app/interfaces/query-string/search';


@Component({
  selector: 'app-contact-add-modal',
  templateUrl: './contact-add-modal.component.html',
  styleUrls: ['./contact-add-modal.component.css']
})
export class ContactAddModalComponent implements OnInit {
  @Output() returnEntry: EventEmitter<any> = new EventEmitter();
  contacts: Contact[];
  errorMessage: string = '';
  closeResult = '';

  queryString: IQueryString<ContactSearch, ContactOrder> = {
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
      }
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
              private repository: ContactRepositoryService,
               private errorHandler: ErrorHandlerService,
               private queryStringService: QueryStringHelper<ContactSearch, ContactOrder>,
                private router: Router,
                private bsModalRef: BsModalRef) { }
  
  ngOnInit(): void {
    this.getAllContacts();
  }

  protected getAllContacts = () => {
    const apiAddress: string = 'Contact' + this.queryStringService.writeQueryStrings(this.queryString);
    this.repository.getContacts(apiAddress)
    .subscribe({
      next: (response: HttpResponse<Contact[]>) => {
        this.contacts = response.body,
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

  public returnContact = (contact:Contact) => {
    this.returnEntry.emit(contact);
  }

}
