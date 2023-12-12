import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { Contact } from 'src/app/interfaces/contact/contact.model';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceAddModalComponent } from 'src/app/shared/modals/service-add-modal/service-add-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { ContactAddModalComponent } from 'src/app/shared/modals/contact-add-modal/contact-add-modal.component';


@Component({
  selector: 'app-scheduling-manage-contact',
  templateUrl: './scheduling-manage-contact.component.html',
  styleUrls: ['./scheduling-manage-contact.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: forwardRef(() => SchedulingManageContactComponent) 
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: SchedulingManageContactComponent
    }
  ]
})
export class SchedulingManageContactComponent implements OnInit {

  @Input() contact: Contact;

  constructor(config: NgbModalConfig, private modalContact: NgbModal,private modalContact2: BsModalService, private router: Router) { }

  ngOnInit(): void {
  }

  handleEvent = (event: string, contact: Contact) =>{
    switch(event){
      case 'Remove':
        this.contact = null
        this.onChanged(this.contact);
        this.onValidationChange();
        break;
      case 'Clicked':
        const detailsUrl: string = `/contact/details/${contact.code}`;
        this.router.navigate([detailsUrl]);
        break;
    }
  }

  open() {
    const modalRef = this.modalContact.open(ContactAddModalComponent)
    modalRef.componentInstance.returnEntry.subscribe((receivedEntry) => {
        this.contact = receivedEntry;
        modalRef.close();
        this.onChanged(this.contact);
        this.onValidationChange();
    })
    
  }
  //FORM VALIDATIONS

  onChanged = (contact) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  onAdd() {
    this.markAsTouched();
    if (!this.disabled) {
      this.onChanged(this.contact);
    }
  }

  onRemove() {
    this.markAsTouched();
    if (!this.disabled) {
      this.onChanged(this.contact);
    }
  }

  writeValue(contactWritten: Contact) {
    this.contact = contactWritten;
  }

  registerOnChange(onChange: any) {
    this.onChanged = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const contact = control.value;
    if (contact ==  null) {
      return {
        mustBeFilled: true
      };
    }

    return null
  }

  onValidationChange: any = () => {};

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
}
}
