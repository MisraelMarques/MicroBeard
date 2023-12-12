import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { ContactRepositoryService } from 'src/app/shared/services/repositories/contact-repository.service';
import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/interfaces/contact/contact.model';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { SchedulingDeleteModalComponent } from 'src/app/shared/modals/scheduling-delete-modal/scheduling-delete-modal.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-delete',
  templateUrl: './contact-delete.component.html',
  styleUrls: ['./contact-delete.component.css']
})
export class ContactDeleteComponent implements OnInit {
  contact: Contact;
  bsModalRef?: BsModalRef;

  constructor(private repository: ContactRepositoryService,
              private errorHandler: ErrorHandlerService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private modal: BsModalService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getContactByCode();
  }

  private getContactByCode = () => {
    const contactCode: string = this.activeRoute.snapshot.params['code'];
    const apiUrl: string = `Contact/${contactCode}`;

    this.repository.getContact(apiUrl)
    .subscribe({
      next: (colab: Contact) => this.contact = colab,
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
  }

  redirectToContactList = () => {
    this.router.navigate(['/contact/list']);
  }

  deleteContact = (force:Boolean) => {
    let deleteUri: string = `Contact/${this.contact.code}`;

    if(force === true) {
      deleteUri += '?force=true';
    }

    this.repository.deleteContact(deleteUri)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Mensagem de Sucesso',
            modalBodyText: 'Cliente deletado com sucesso!',
            okButtonText: 'OK'
          }
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToContactList());
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
    var contactCode = this.contact.code;
    const modalRef = this.modalService.open(SchedulingDeleteModalComponent)
    modalRef.componentInstance.queryString.Search.ContactCode.SearchValue = contactCode;
    modalRef.result.then(
      (data: any) => {
        if(data == 'force'){
          this.deleteContact(true);
        }
      },
      (reason: any) => { });  
  }

}
