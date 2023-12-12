import { Component, Input, OnInit } from '@angular/core';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Scheduling } from 'src/app/interfaces/scheduling/scheduling.model';
import { SchedulingForUpdate } from 'src/app/interfaces/scheduling/scheduling-update.model';
import { SchedulingRepositoryService } from 'src/app/shared/services/repositories/scheduling-repository.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ServiceRepositoryService } from 'src/app/shared/services/repositories/service-repository.service';
import { Service } from 'src/app/interfaces/service/service.model';
import { Collaborator } from 'src/app/interfaces/collaborator/collaborator.model';
import { delay } from 'rxjs';

import * as locales from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';


function defineLocales() {
  for (const locale in locales) {
      defineLocale(locales[locale].abbr, locales[locale]);
  }
}

@Component({
  selector: 'app-scheduling-update',
  templateUrl: './scheduling-update.component.html',
  styleUrls: ['./scheduling-update.component.css']
})
export class SchedulingUpdateComponent implements OnInit {
  scheduling: Scheduling
  schedulingForm: FormGroup;
  bsModalRef?: BsModalRef;
  dateError: boolean = false;
  schedulingLicenseCode: {licenseCode: number} = {licenseCode: 0};
  startTime: Date;
  endTime: Date;


  constructor(private repository: SchedulingRepositoryService,
              private errorHandler: ErrorHandlerService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              private modal: BsModalService,
              private localeService: BsLocaleService,
              fb: FormBuilder,
              private serviceRepository: ServiceRepositoryService) { }

  ngOnInit(): void {
    this.schedulingForm = new FormGroup({
      title: new FormControl('', [Validators.maxLength(100)]),
      date: new FormControl('',[Validators.required]),
      startTime: new FormControl('',[Validators.required]),
      endTime: new FormControl('',[Validators.required]),
      contact: new FormControl('',[Validators.required]),
      service: new FormControl('',[Validators.required]),
      collaborator: new FormControl('',[Validators.required]),
    }, {validators: [timeValidator, serviceValidator(this.schedulingLicenseCode)]});

    defineLocales();
    this.localeService.use('pt-br')
    this.getSchedulingByCode();
  }

  private getSchedulingByCode = () => {
    const schedulingCode: string = this.activeRoute.snapshot.params['code'];
    const schedulingByCodeUri: string = `Scheduling/${schedulingCode}`;
    this.repository.getScheduling(schedulingByCodeUri)
    .subscribe({
      next: (sched: Scheduling) => {
        this.scheduling = { ...sched, 
          date: new Date(sched.date+'-00:00'),
          endDate: new Date(sched.endDate+'-00:00')
        };

        this.schedulingForm.patchValue(this.scheduling);

        this.startTime = new Date(sched.date+'-00:00')
        this.endTime = new Date(sched.endDate+'-00:00');

        if(this.scheduling.license?.service  != null || this.scheduling.license?.service != undefined){
          const apiUrl: string = `Service/${this.scheduling.license.service.code}`;
          this.serviceRepository.getService(apiUrl)
          .subscribe({
            next: (serv: Service) => {
              this.scheduling.license.service = serv
              this.schedulingForm.patchValue({
                service: this.scheduling.license?.service,
                collaborator: this.scheduling.license?.collaborator
              })
            }
          })
        }
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
  }

  validateControl = (controlName: string) => {
    if (this.schedulingForm.get(controlName).invalid && this.schedulingForm.get(controlName).touched)
      return true;
    return false;
  } 
  
  hasError = (controlName: string, errorName: string) => {
    if (this.schedulingForm.get(controlName).hasError(errorName))
      return true;
    
    return false;
  }

  public updateScheduling = (schedulingFormValue) => {
    if(this.schedulingForm.valid)
      this.executeSchedulingUpdate(schedulingFormValue)
  }

  private executeSchedulingUpdate = (schedulingFormValue) => {
    const schedulingForUpd: SchedulingForUpdate = {
      title: schedulingFormValue.title,
      date: this.JoinDateAndTime(schedulingFormValue.date, schedulingFormValue.startTime).toISOString(),
      endDate: this.JoinDateAndTime(schedulingFormValue.date, schedulingFormValue.endTime).toISOString(),
      contactCode: schedulingFormValue.contact.code,
      licenseCode: this.schedulingLicenseCode.licenseCode,
    }

    const apiUri: string = `Scheduling/${this.scheduling.code}`;

    this.repository.updateScheduling(apiUri, schedulingForUpd)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Mensagem de sucesso',
            modalBodyText: 'Agendamento atualizado com sucesso',
            okButtonText: 'OK'
          }
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToSchedulingList());
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
  }

  private JoinDateAndTime(dateValue: Date, timeValue: Date): Date{
    var date = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate(), timeValue.getHours(), timeValue.getMinutes())
    return date
  }
 
  public redirectToSchedulingList = () => {
    this.router.navigate(['/scheduling/calendar'])
  }
}

export const timeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startTime = control.get('startTime')?.value;
  const endTime = control.get('endTime')?.value;
  var endHour = new Date(endTime).getHours();
  var startHour = new Date(startTime).getHours();
  var returnedObject = {
      invalidStartTimeRange: false,
      invalidEndTimeRange: false,
      invalidEndTime: false,
      timeErrorMessage: "O horário de funcionamento é das 8 as 18, selecione um horário adequado",
      endTimeErrorMessage: "O encerramento do agentamento deve ser depois do início"
    };

  var hasError = false;
  if(startHour > 18 || startHour < 8) {
    returnedObject.invalidStartTimeRange = true;
    hasError = true;
  }

  if(endHour > 18 || endHour < 8) {
    returnedObject.invalidEndTimeRange = true
    hasError= true;
  }

  if(startTime >= endTime){
    returnedObject.invalidEndTime = true
    hasError = true;
  }
  if(hasError){
    return returnedObject;
  }
  else return null;
}

export  function serviceValidator(returnedlicenseCode:{licenseCode: number}) : ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null  => {
    const service = control.get('service').value;
    const collaborator = control.get('collaborator').value;

    if (service === null || service === undefined || service === ''){
      return null
    }
    else {
      if(collaborator === null || collaborator === undefined || collaborator === ''){
        return null;
      }
      let invalidLicense = true;
      if(service.licenses != null || service.licenses != undefined){
        service.licenses.forEach(license => {
          if(license.collaboratorCode == collaborator.code){
            invalidLicense = false;
            if(license.code != null || license.code != undefined){
              returnedlicenseCode.licenseCode = license.code
            }
          }
        });

        if(invalidLicense == true){
          return {invalidLicense: true,
            serviceErrorMessage: "Esse serviço não está autorizado nesse colaborador selecionado",
            collaboratorErrorMessage: "Esse colaborador não está autorizado nesse serviço selecionado"}
        }
        else{
          return null
        }
      }
    }
  }
}