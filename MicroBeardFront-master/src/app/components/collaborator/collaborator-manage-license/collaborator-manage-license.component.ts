import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { Service } from 'src/app/interfaces/service/service.model';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceAddModalComponent } from 'src/app/shared/modals/service-add-modal/service-add-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { License } from 'src/app/interfaces/license/license.model';

@Component({
  selector: 'app-collaborator-manage-license',
  templateUrl: './collaborator-manage-license.component.html',
  styleUrls: ['./collaborator-manage-license.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: forwardRef(() => CollaboratorManageLicenseComponent) 
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CollaboratorManageLicenseComponent
    }
  ]
})
export class CollaboratorManageLicenseComponent implements OnInit {
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
        const detailsUrl: string = `/service/details/${license.service.code}`;
        this.router.navigate([detailsUrl]);
        break;
    }
  }

  open() {
    const modalRef = this.modalService.open(ServiceAddModalComponent)
    modalRef.componentInstance.returnEntry.subscribe((receivedEntry) => {
      if(!this.licenses.some(license => license.service.code == receivedEntry.code)){

        const createdLicense : License = {
          serviceCode: receivedEntry.code,
          service: receivedEntry
        }

        this.licenses.push(createdLicense);

        this.onChanged(this.licenses);
        this.onValidationChange();
      }
      else {
        modalRef.close();
      }
    })
    
  }

  //FORM VALIDATIONS

  onChanged = (license) => {};

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

  writeValue(serviceWritten: Service[]) {
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
    const services = control.value;
    if (services == null) {
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


