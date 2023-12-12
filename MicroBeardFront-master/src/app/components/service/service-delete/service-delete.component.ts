import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { ServiceRepositoryService } from 'src/app/shared/services/repositories/service-repository.service';
import { Component, OnInit } from '@angular/core';
import { Service } from 'src/app/interfaces/service/service.model';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { SchedulingDeleteModalComponent } from 'src/app/shared/modals/scheduling-delete-modal/scheduling-delete-modal.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-service-delete',
  templateUrl: './service-delete.component.html',
  styleUrls: ['./service-delete.component.css']
})
export class ServiceDeleteComponent implements OnInit {
  service: Service;
  bsModalRef?: BsModalRef;
  role: string;

  constructor(private repository: ServiceRepositoryService,
              private errorHandler: ErrorHandlerService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private modal: BsModalService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getServiceByCode();
    this.role = localStorage.getItem('userRole');
  }

  ngAfterContentChecked(): void {
    this.role !== 'Collaborator' 
    ? null
    : this.router.navigate(['service/list']);
  }

  private getServiceByCode = () => {
    const serviceCode: string = this.activeRoute.snapshot.params['code'];
    const apiUrl: string = `Service/${serviceCode}`;

    this.repository.getService(apiUrl)
    .subscribe({
      next: (colab: Service) => this.service = colab,
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
  }

  redirectToServiceList = () => {
    this.router.navigate(['/service/list']);
  }

  deleteService = (force:Boolean) => {
    let deleteUri: string = `Service/${this.service.code}`;

    if(force === true) {
      deleteUri += '?force=true';
    }

    this.repository.deleteService(deleteUri)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Mensagem de Sucesso',
            modalBodyText: 'Serviço deletado com sucesso!',
            okButtonText: 'OK'
          }
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToServiceList());
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
    var serviceCode = this.service.code;
    const modalRef = this.modalService.open(SchedulingDeleteModalComponent)
    modalRef.componentInstance.queryString.Search.ServiceCode.SearchValue = serviceCode;
    modalRef.result.then(
      (data: any) => {
        if(data == 'force'){
          this.deleteService(true);
        }
      },
      (reason: any) => { });  
  }

}
