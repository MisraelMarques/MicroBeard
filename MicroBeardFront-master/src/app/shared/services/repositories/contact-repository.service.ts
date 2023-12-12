import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from '../environment-url.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contact } from 'src/app/interfaces/contact/contact.model';
import { ContactForCreation } from 'src/app/interfaces/contact/contact-create.model';
import { ContactForUpdate } from 'src/app/interfaces/contact/contact-update.model';
import { RepositoryService } from './repository.service';

@Injectable({
  providedIn: 'root',
})
export class ContactRepositoryService {
  constructor(
    private http: HttpClient,
    private envUrl: EnvironmentUrlService,
    private repo: RepositoryService
  ) {}

  public getContacts = (route: string) => {
    return this.http.get<Contact[]>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      {observe: 'response'}
    );
  };

  public getContact = (route: string) => {
    return this.http.get<Contact>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      
    );
  };

  public createContact = (route: string, contact: ContactForCreation) => {
    return this.http.post<Contact>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      contact,
      
    );
  };

  public updateContact = (route: string, contact: ContactForUpdate) => {
    return this.http.put(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      contact,
      
    );
  };

  public deleteContact = (route: string) => {
    return this.http.delete(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      
    );
  };
}
