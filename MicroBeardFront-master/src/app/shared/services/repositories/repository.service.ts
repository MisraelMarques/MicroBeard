import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor() { }

  createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  };

  generateHeaders = () => {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      }),
    };
  };
}
