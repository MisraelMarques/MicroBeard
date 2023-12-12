import { Component, OnInit } from '@angular/core';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { ContactRepositoryService } from 'src/app/shared/services/repositories/contact-repository.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Contact } from 'src/app/interfaces/contact/contact.model';
import { ContactForCreation } from 'src/app/interfaces/contact/contact-create.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent implements OnInit {
  errorMessage: string = '';
  contactForm: FormGroup;
  bsModalRef?: BsModalRef;

  constructor(private repository: ContactRepositoryService,
              private errorHandler: ErrorHandlerService,
              private router: Router,
              private datePipe: DatePipe,
              private modal: BsModalService) { }

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      address: new FormControl('',[Validators.maxLength(200)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(80), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl('',[Validators.minLength(8),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
      cpf: new FormControl('',[Validators.minLength(13), Validators.maxLength(14)]),
      phone: new FormControl('',[Validators.maxLength(15), Validators.pattern("(\\(?\\d{2}\\)?\\s?)?(9?\\d{4}\\-?\\d{4})")]),
      gender: new FormControl('',[Validators.maxLength(1), Validators.pattern("[MFmf]")]),
      birthDate: new FormControl('', [Validators.required, dateValidator]),
    });
  }

  validateControl = (controlName: string) => {
    if (this.contactForm.get(controlName).invalid && this.contactForm.get(controlName).touched)
      return true;
    
    return false;
  } 
  
  hasError = (controlName: string, errorName: string) => {
    if (this.contactForm.get(controlName).hasError(errorName))
      return true;
    
    return false;
  }

  createContact = (contactFormValue) => {
    if(this.contactForm.valid)
      this.executeContactCreation(contactFormValue);
  }

  getCpf(cpf: string): string{
    return cpf.replace(/[.-]/g, "");
  }


  private executeContactCreation = (contactFormValue) => {
    const contact: ContactForCreation = {
      name: contactFormValue.name,
      address: contactFormValue.address,
      email: contactFormValue.email,
      password: contactFormValue.password,
      cpf: this.getCpf(contactFormValue.cpf),
      phone: contactFormValue.phone,
      gender: contactFormValue.gender,
      birthDate: this.datePipe.transform(contactFormValue.birthDate, 'yyyy-MM-dd'),
    }

    const apiUrl = 'Contact';
    this.repository.createContact(apiUrl, contact)
    .subscribe({
      next: (cont: Contact) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Mensagem de Sucesso',
            modalBodyText: `Cliente: ${cont.name} cadastrado com sucesso!`,
            okButtonText: 'OK'
          }
        };
  
        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToContactList());
      },
      error: (err: HttpErrorResponse) => {
          this.errorHandler.handleError(err);
          this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

  redirectToContactList = () => {
    this.router.navigate(['/contact/list']);
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