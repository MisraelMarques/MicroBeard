import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ErrorModalComponent } from '../modals/error-modal/error-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  public errorMessage: string = '';

  constructor(private router: Router, private modal: BsModalService) {}

  public handleError = (error: HttpErrorResponse) => {
    
    let errorCode = Number.parseInt(JSON.stringify(error).split(':')[2].substring(1,4))
    console.log(errorCode)
    errorCode =error.status? error.status : errorCode
    if (errorCode == 500) {
      this.handle500Error(error);
    } else if (errorCode === 404) {
      this.handle404Error(error);
    } else if (errorCode === 401) {
      this.handle401Error(error);
    } else if (errorCode === 409) {
      this.handle409Error(error);
    } else if(errorCode == 400){
      this.handle400Error(error)
    }
    else {
      this.errorMessage = "Ocorreu um erro"
      this.handleOtherError(error);
    }
  };

  private handle500Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/500']);
  };

  private handle409Error = (error: HttpErrorResponse) => {
      const config: ModalOptions = {
        initialState: {
          modalHeaderText: 'Error Message',
          modalBodyText: 'Ocorreu um conflito nos horários do colaborador desses agendamentos.',
          okButtonText: 'OK',
        },
      };
      this.modal.show(ErrorModalComponent, config);
  };

  private handle400Error = (error: HttpErrorResponse) => {
    const config: ModalOptions = {
      initialState: {
        modalHeaderText: 'Error Message',
        modalBodyText: 'Existe algum erro nesse objeto.',
        okButtonText: 'OK',
      },
    };
    this.modal.show(ErrorModalComponent, config);
};

  private handle404Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/404']);
  };

  private handle401Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/401']);
  };

  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);

    const config: ModalOptions = {
      initialState: {
        modalHeaderText: 'Error Message',
        modalBodyText: this.errorMessage,
        okButtonText: 'OK',
      },
    };
    this.modal.show(ErrorModalComponent, config);
  };

  private createErrorMessage = (error: HttpErrorResponse) => {
    if (
      this.errorMessage != '' &&
      this.errorMessage != null &&
      this.errorMessage != undefined
    ) {
      this.errorMessage = error.error
        ? JSON.stringify(error.error)
        : error.statusText;
    } else {
      this.errorMessage =
        'Ocorreu um erro';
    }
  };
}
