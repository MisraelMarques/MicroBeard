import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceAddModalComponent } from 'src/app/shared/modals/service-add-modal/service-add-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { License } from 'src/app/interfaces/license/license.model';
import { CollaboratorAddModalComponent } from 'src/app/shared/modals/collaborator-add-modal/collaborator-add-modal.component';
import { Collaborator } from 'src/app/interfaces/collaborator/collaborator.model';


@Component({
  selector: 'app-service-manage-license',
  templateUrl: './service-manage-license.component.html',
  styleUrls: ['./service-manage-license.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: forwardRef(() => ServiceManageLicenseComponent) 
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ServiceManageLicenseComponent
    }
  ]
})
export class ServiceManageLicenseComponent implements OnInit {

  @Input() licenses: License[];

  constructor(config: NgbModalConfig, private modalService: NgbModal,private modalService2: BsModalService, private router: Router) { }

  ngOnInit(): void {
  }

  handleEvent = (event: string, license: License) =>{
    switch(event){
      case 'Remove':
        this.licenses.splice(this.licenses.indexOf(license), 1)
        this.onChanged(this.licenses);
        this.onValidationChange();
        break;
      case 'Clicked':
        const detailsUrl: string = `/collaborator/details/${license.collaborator.code}`;
        this.router.navigate([detailsUrl]);
        break;
    }
  }

  open() {
    const modalRef = this.modalService.open(CollaboratorAddModalComponent)
    modalRef.componentInstance.returnEntry.subscribe((receivedEntry) => {
      if(!this.licenses.some(license => license.collaborator.code == receivedEntry.code)){

        const createdLicense : License = {
          collaboratorCode: receivedEntry.code,
          collaborator: receivedEntry
        }
        this.licenses.push(createdLicense);

        this.onChanged(this.licenses);
        this.onValidationChange();
      }
      else{
        modalRef.close();
      }
    })
    
  }
  //FORM VALIDATIONS

  onChanged = (service) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  onAdd() {
    this.markAsTouched();
    if (!this.disabled) {
      this.onChanged(this.licenses);
    }
  }

  onRemove() {
    this.markAsTouched();
    if (!this.disabled) {
      this.onChanged(this.licenses);
    }
  }

  writeValue(serviceWritten: Collaborator[]) {
    this.licenses = serviceWritten;
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
    const license = control.value;
    if (license == null) {
      return {
        licenseValid: true
      };
    }
  }

  onValidationChange: any = () => {};

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }
}
