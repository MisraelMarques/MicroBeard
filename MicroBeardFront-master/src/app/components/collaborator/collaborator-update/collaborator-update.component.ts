import { Component, OnInit } from '@angular/core';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { CollaboratorRepositoryService } from 'src/app/shared/services/repositories/collaborator-repository.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Collaborator } from 'src/app/interfaces/collaborator/collaborator.model';
import { CollaboratorForUpdate } from 'src/app/interfaces/collaborator/collaborator-update.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { License } from 'src/app/interfaces/license/license.model';
import { LinkedList } from 'ngx-bootstrap/utils';

@Component({
  selector: 'app-collaborator-update',
  templateUrl: './collaborator-update.component.html',
  styleUrls: ['./collaborator-update.component.css']
})
export class CollaboratorUpdateComponent implements OnInit {
  collaborator: Collaborator
  collaboratorForm: FormGroup;
  bsModalRef?: BsModalRef;
  role: string;

  constructor(private repository: CollaboratorRepositoryService,
              private errorHandler: ErrorHandlerService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private datePipe: DatePipe,
              private modal: BsModalService) { }

  ngOnInit(): void {
    this.collaboratorForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      birthDate: new FormControl('', dateValidator),
      email: new FormControl('', [Validators.required, Validators.maxLength(80), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl('',[Validators.minLength(8),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      phone: new FormControl('',[Validators.maxLength(15), Validators.pattern("(\\(?\\d{2}\\)?\\s?)?(9?\\d{4}\\-?\\d{4})")]),
      function: new FormControl('',[Validators.maxLength(100)]),
      salary: new FormControl('',[Validators.min(0), Validators.max(999999.99)]),
      commision: new FormControl('',[Validators.min(0), Validators.max(999999.99)]),
      isAdmin: new FormControl('',[]),
      licenses: new FormControl('', []),
    });

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
    const collaboratorByCodeUri: string = `Collaborator/${collaboratorCode}`;
    this.repository.getCollaborator(collaboratorByCodeUri)
    .subscribe({
      next: (collab: Collaborator) => {
        this.collaborator = { ...collab, 
          birthDate: new Date(this.datePipe.transform(collab.birthDate, 'MM/dd/yyyy'))
        };
        this.collaboratorForm.patchValue(this.collaborator);
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
  }

  validateControl = (controlName: string) => {
    console.log(this.collaboratorForm.get('birthDate'))
    if (this.collaboratorForm.get(controlName).invalid && this.collaboratorForm.get(controlName).touched)
      return true;
    
    return false;
  } 
  
  hasError = (controlName: string, errorName: string) => {
    if (this.collaboratorForm.get(controlName).hasError(errorName))
      return true;
    
    return false;
  }

  public updateCollaborator = (collaboratorFormValue) => {
    if(this.collaboratorForm.valid)
      this.executeCollaboratorUpdate(collaboratorFormValue)
  }

  private executeCollaboratorUpdate = (collaboratorFormValue) => {
    const collaboratorForUpd: CollaboratorForUpdate = {
      name: collaboratorFormValue.name,
      birthDate: this.datePipe.transform(collaboratorFormValue.birthDate, 'yyyy-MM-dd'),
      email: collaboratorFormValue.email,
      password: collaboratorFormValue.password,
      phone: collaboratorFormValue.phone,
      function: collaboratorFormValue.function,
      salary: collaboratorFormValue.salary,
      commision: collaboratorFormValue.commision,
      isAdmin: collaboratorFormValue.isAdmin ? collaboratorFormValue.isAdmin : false,
      licenses: collaboratorFormValue.licenses,
    }

    const apiUri: string = `Collaborator/${this.collaborator.code}`;

    this.repository.updateCollaborator(apiUri, collaboratorForUpd)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Mensagem de Sucesso',
            modalBodyText: 'Colaborador alterado com sucesso!',
            okButtonText: 'OK'
          }
        };

        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToCollaboratorList());
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
  }

  public redirectToCollaboratorList = () => {
    this.router.navigate(['/collaborator/list'])
  }
}

export const dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const controlBirthDate = control.value as Date;
  var todayDate = new Date();
  todayDate.setHours(0,0,0,0);

  if(controlBirthDate <= todayDate) {
    return null;
  }
  else{
    return {"invalidDate":true}
  }
}