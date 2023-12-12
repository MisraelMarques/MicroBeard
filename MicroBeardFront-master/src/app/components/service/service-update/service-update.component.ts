import { Component, OnInit } from '@angular/core';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { ServiceRepositoryService } from 'src/app/shared/services/repositories/service-repository.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Service } from 'src/app/interfaces/service/service.model';
import { ServiceForUpdate } from 'src/app/interfaces/service/service-update.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-service-update',
  templateUrl: './service-update.component.html',
  styleUrls: ['./service-update.component.css']
})
export class ServiceUpdateComponent implements OnInit {
  service: Service
  serviceForm: FormGroup;
  bsModalRef?: BsModalRef;
  role: string;

  constructor(private repository: ServiceRepositoryService,
              private errorHandler: ErrorHandlerService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private modal: BsModalService) { }

  ngOnInit(): void {
    this.serviceForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      price: new FormControl('',[Validators.min(0), Validators.max(999999.99)]),
      time: new FormControl('',[Validators.min(0), Validators.max(10000)]),
      type: new FormControl('', [Validators.maxLength(50)]),
      description: new FormControl('', [Validators.maxLength(250)]),
      licenses: new FormControl('', []),
    });

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
    const serviceByCodeUri: string = `Service/${serviceCode}`;
    this.repository.getService(serviceByCodeUri)
    .subscribe({
      next: (cont: Service) => {
        this.service = {
          ...cont,
        };
        this.serviceForm.patchValue(this.service);
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
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

  public updateService = (serviceFormValue) => {
    if(this.serviceForm.valid)
      this.executeServiceUpdate(serviceFormValue)
  }

  private executeServiceUpdate = (serviceFormValue) => {
    const serviceForUpd: ServiceForUpdate = {
      name: serviceFormValue.name,
      price: serviceFormValue.price,
      time: serviceFormValue.time,
      type: serviceFormValue.type,
      description: serviceFormValue.description,
      licenses: serviceFormValue.licenses
    }

    const apiUri: string = `Service/${this.service.code}`;

    this.repository.updateService(apiUri, serviceForUpd)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Mensagem de Sucesso',
            modalBodyText: 'Serviço alterado com sucesso!',
            okButtonText: 'OK'
          }
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToServiceList());
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
  }

  public redirectToServiceList = () => {
    this.router.navigate(['/service/list'])
  }

  public redirectToUpdatePage = (code) => { 
    const updateUrl: string = `/service/update/${code}`; 
    this.router.navigate([updateUrl]); 
  }
  
}
