import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRepositoryService } from '../repositories/auth-repository.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  bsModalRef?: BsModalRef;
  errorMessage: string = '';

  constructor(
    private userService: AuthRepositoryService,
    private errorHandler: ErrorHandlerService,
    private modal: BsModalService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.userService.getUserToken;
    const requestUrl: Array<any> = request.url.split('/');
    const apiUrl: Array<any> = environment.urlAddress.split('/');
    const logoutUrl: string = `Collaborator/Logout`;

    if (token && requestUrl[2] === apiUrl[2]) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          token: `${token}`,
        },
      });
      return next.handle(request).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.userService.logout(logoutUrl).subscribe({
              next: () => {
                const config: ModalOptions = {
                  initialState: {
                    modalHeaderText: 'Mensagem de Sucesso',
                    modalBodyText: `Usuário deslogado com sucesso!`,
                    okButtonText: 'OK',
                  },
                };

                this.bsModalRef = this.modal.show(
                  SuccessModalComponent,
                  config
                );
              },
              error: (err: HttpErrorResponse) => {
                this.userService.goToLogin();
              },
            });
          } else {
            return throwError(() => error.message);
          }
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
