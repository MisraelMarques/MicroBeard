import { Component, OnInit } from '@angular/core';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthRepositoryService } from 'src/app/shared/services/repositories/auth-repository.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  isCollapsed: boolean = false;
  errorMessage: string = '';
  bsModalRef?: BsModalRef;

  constructor(
    private authRepo: AuthRepositoryService,
    private errorHandler: ErrorHandlerService,
    private modal: BsModalService
  ) {}

  ngOnInit(): void {}

  logout() {
    const apiUri: string = `Collaborator/Logout`;
    this.authRepo.logout(apiUri).subscribe({
      next: () => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Mensagem de Sucesso',
            modalBodyText: `Usuário deslogado com sucesso!`,
            okButtonText: 'OK',
          },
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
      },
      error: (err: HttpErrorResponse) => {
        this.authRepo.goToLogin();
        this.errorHandler.handleError(err);
        this.errorMessage = this.errorHandler.errorMessage;
      },
    });
  }
}
