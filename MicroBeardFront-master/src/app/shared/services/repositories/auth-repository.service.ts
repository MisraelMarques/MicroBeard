import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from '../environment-url.service';
import { RepositoryService } from './repository.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthForUser } from 'src/app/interfaces/auth/auth-user.model';
import jwt_decode from 'jwt-decode';
import { User } from 'src/app/interfaces/auth/user.model';
import { TokenResponse } from 'src/app/interfaces/auth/token-reponse.model';

@Injectable({
  providedIn: 'root',
})
export class AuthRepositoryService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private envUrl: EnvironmentUrlService,
    private repo: RepositoryService
  ) {}

  public login = (route: string, user: AuthForUser) => {
    return this.http.post<AuthForUser>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      user,
    ).pipe(tap((response) => {
      localStorage.setItem('token', JSON.stringify(response).split(' ')[1].slice(0, -1));
      const tokenInfo = this.getDecodedAccessToken(localStorage.getItem('token'));
      const userToken = this.mapToUser(tokenInfo);
      localStorage.setItem('userCode', userToken.code);
      localStorage.setItem('userRole', userToken.role);
      this.router.navigate(['']);
    }));
  };

  public logout = (route: string) => {
    return this.http.post<any>(
      this.repo.createCompleteRoute(route, this.envUrl.urlAddress),
      {},
     ).pipe(tap(() => {
      localStorage.clear();
      this.router.navigate(['login']);
    }));
  };

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  mapToUser(tokenInfo: TokenResponse): any {
    let user: User = {
      role: tokenInfo.role,
      code: tokenInfo.Code,
    }
    return user;
  }

  // get getLoggedUser(): AuthForUser {
  //   return localStorage.getItem('user')
  //     ? JSON.parse(localStorage.getItem('user'))
  //     : null;
  // }
  // get getLoggedUserId(): string {
  //   return localStorage.getItem('user')
  //     ? (JSON.parse(localStorage.getItem('user')) as AuthForUser).id
  //     : null;
  // }
  get getUserToken(): string {
    return localStorage.getItem('token')
      ? localStorage.getItem('token')
      : null;
  }
  get isLogged(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

  public goToLogin(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
