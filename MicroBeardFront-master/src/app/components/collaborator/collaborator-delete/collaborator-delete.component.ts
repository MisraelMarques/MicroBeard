import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { CollaboratorRepositoryService } from 'src/app/shared/services/repositories/collaborator-repository.service';
import { Component, OnInit } from '@angular/core';
import { Collaborator } from 'src/app/interfaces/collaborator/collaborator.model';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SchedulingDeleteModalComponent } from 'src/app/shared/modals/scheduling-delete-modal/scheduling-delete-modal.component';


@Component({
  selector: 'app-collaborator-delete',
  templateUrl: './collaborator-delete.component.html',
  styleUrls: ['./collaborator-delete.component.css']
})
export class CollaboratorDeleteComponent implements OnInit {
  collaborator: Collaborator;
  bsModalRef?: BsModalRef;
  role: string;

  constructor(private repository: CollaboratorRepositoryService,
              private errorHandler: ErrorHandlerService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private modal: BsModalService,
              private modalCollaborator: NgbModal) { }

  ngOnInit(): void {
    this.getCollaboratorByCode();
    this.role = localStorage.getItem('userRole');
  }

  ngAfterContentChecked(): void {
    this.role !== 'Collaborator' 
    ? null
    : this.router.navigate(['collaborator/list']);
  }

  private getCollaboratorByCode = () => {
    const collaboratorCode: string = this.activeRoute.snapshot.params['code'];
    const apiUrl: string = `Collaborator/${collaboratorCode}`;

    this.repository.getCollaborator(apiUrl)
    .subscribe({
      next: (colab: Collaborator) => this.collaborator = colab,
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
  }

  redirectToCollaboratorList = () => {
    this.router.navigate(['/collaborator/list']);
  }

  deleteCollaborator = (force: Boolean) => {
    let deleteUri: string = `Collaborator/${this.collaborator.code}`;
    if(force === true) {
      deleteUri += '?force=true';
    }

    this.repository.deleteCollaborator(deleteUri)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Mensagem de Sucesso',
            modalBodyText: 'Colaborador excluído com sucesso!',
            okButtonText: 'OK'
          }
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToCollaboratorList());
      },
      error: (err: HttpErrorResponse) => {
        let errorCode = Number.parseInt(JSON.stringify(err).split(':')[2].substring(1,4))

        if(errorCode == 403){
          this.open()
        }
        else{
          this.errorHandler.handleError(err)
        }
      }
    })
  }

  open() {
    var collaboratorCode = this.collaborator.code;
    const modalRef = this.modalCollaborator.open(SchedulingDeleteModalComponent)
    modalRef.componentInstance.queryString.Search.CollaboratorCode.SearchValue = collaboratorCode;
    modalRef.result.then(
      (data: any) => {
        if(data == 'force'){
          this.deleteCollaborator(true);
        }
      },
      (reason: any) => { });  
  }
}
