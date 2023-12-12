import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from 'src/app/interfaces/contact/contact.model';
import { ContactRepositoryService } from 'src/app/shared/services/repositories/contact-repository.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IQueryString } from 'src/app/interfaces/query-string/query-string';
import { ContactSearch } from 'src/app/interfaces/contact/contact-search';
import { ContactOrder } from 'src/app/interfaces/contact/contact-order';
import { Order } from 'src/app/enums/order-enum';
import { QueryStringHelper } from 'src/app/shared/helpers/query-string-helper';
import { IPagination } from 'src/app/interfaces/query-string/pagination';
import { ISearchType } from 'src/app/interfaces/query-string/search';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Contact[];
  errorMessage: string = '';

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
        OrderName: 'Code',
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

  constructor(private repository: ContactRepositoryService,
               private errorHandler: ErrorHandlerService,
               private queryStringService: QueryStringHelper<ContactSearch, ContactOrder>,
                private router: Router) { }

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

  public updateOrdination = (ordination: string) =>{
    this.queryString = this.queryStringService.updateQueryStringOrdination(ordination, this.queryString) as IQueryString<ContactSearch, ContactOrder>
    this.getAllContacts();
  }

  private getContactDetails = (code) =>{
    const detailsUrl: string = `/contact/details/${code}`;
    this.router.navigate([detailsUrl]);
  }

  public redirectToUpdatePage = (code) => { 
    const updateUrl: string = `/contact/update/${code}`; 
    this.router.navigate([updateUrl]); 
  }

  public redirectToDeletePage = (code) => {
    const deleteUrl: string = `/contact/delete/${code}`;
    this.router.navigate([deleteUrl])
  }
}
