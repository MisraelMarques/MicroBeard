import { Component, OnInit } from '@angular/core';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { ServiceRepositoryService } from 'src/app/shared/services/repositories/service-repository.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Service } from 'src/app/interfaces/service/service.model';
import { ServiceForCreation } from 'src/app/interfaces/service/service-create.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { License } from 'src/app/interfaces/license/license.model';

@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.css']
})
export class ServiceCreateComponent implements OnInit {
  licenses: License[] = [];
  errorMessage: string = '';
  serviceForm: FormGroup;
  bsModalRef?: BsModalRef;
  role: string;

  constructor(private repository: ServiceRepositoryService,
              private errorHandler: ErrorHandlerService,
              private router: Router,
              private modal: BsModalService) { }

  ngOnInit(): void {
    this.serviceForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      price: new FormControl('',[Validators.min(0), Validators.max(999999.99)]),
      time: new FormControl('',[Validators.min(0), Validators.max(10000)]),
      type: new FormControl('', [Validators.maxLength(50)]),
      description: new FormControl('', [Validators.maxLength(250)]),
      licenses: new FormControl('',[]),
    });

    this.serviceForm.get('licenses').setValue([])

    this.role = localStorage.getItem('userRole');
  }

  ngAfterContentChecked(): void {
    this.role !== 'Collaborator' 
    ? null
    : this.router.navigate(['service/list']);
  }

  validateControl = (controlName: string) => {
    if (this.serviceForm.get(controlName).invalid && this.serviceForm.get(controlName).touched)
      return true;
    
    return false;
  } 
  
  hasError = (controlName: string, errorName: string) => {
    if (this.serviceForm.get(controlName).hasError(errorName))
      return true;
    
    return false;
  }

  createService = (serviceFormValue) => {
    if(this.serviceForm.valid)
      this.executeServiceCreation(serviceFormValue);
  }

  private executeServiceCreation = (serviceFormValue) => {
    const service: ServiceForCreation = {
      name: serviceFormValue.name,
      price: serviceFormValue.price,
      time: serviceFormValue.time,
      type: serviceFormValue.type,
      description: serviceFormValue.description,
      licenses: serviceFormValue.licenses,
      }
    const apiUrl = 'Service';
    this.repository.createService(apiUrl, service)
    .subscribe({
      next: (cont: Service) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Mensagem de Sucesso',
            modalBodyText: `Serviço: ${cont.name} criado com sucesso!`,
            okButtonText: 'OK'
          }
        };
  
        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToServiceList());
      },
      error: (err: HttpErrorResponse) => {
          this.errorHandler.handleError(err);
          this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

  redirectToServiceList = () => {
    this.router.navigate(['/service/list']);
  }
}
