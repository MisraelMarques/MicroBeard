import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { Collaborator } from 'src/app/interfaces/collaborator/collaborator.model';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { CollaboratorAddModalComponent } from 'src/app/shared/modals/collaborator-add-modal/collaborator-add-modal.component';
import { Service } from 'src/app/interfaces/service/service.model';


@Component({
  selector: 'app-scheduling-manage-collaborator',
  templateUrl: './scheduling-manage-collaborator.component.html',
  styleUrls: ['./scheduling-manage-collaborator.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: forwardRef(() => SchedulingManageCollaboratorComponent) 
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: SchedulingManageCollaboratorComponent
    }
  ]
})
export class SchedulingManageCollaboratorComponent implements OnInit {
  
  @Input() service: Service;
  @Input() collaborator: Collaborator;
  @Input() isServiceEmpty: Boolean;

  constructor(config: NgbModalConfig, private modalCollaborator: NgbModal,private modalCollaborator2: BsModalService, private router: Router) { }

  ngOnInit(): void {
  }

  handleEvent = (event: string, collaborator: Collaborator) =>{
    switch(event){
      case 'Remove':
        this.collaborator = null
        this.onChanged(this.collaborator);
        this.onValidationChange();
        break;
      case 'Clicked':
        const detailsUrl: string = `/collaborator/details/${collaborator.code}`;
        this.router.navigate([detailsUrl]);
        break;
    }
  }

  open() {
    var serviceCode = null
    if(this.service != null || this.service != undefined){
      serviceCode = this.service.code
    }

    const modalRef = this.modalCollaborator.open(CollaboratorAddModalComponent)
    modalRef.componentInstance.queryString.Search.ServiceCode.SearchValue = serviceCode
    modalRef.componentInstance.returnEntry.subscribe((receivedEntry) => {
        this.collaborator = receivedEntry;
        modalRef.close();
        this.onChanged(this.collaborator);
        this.onValidationChange();
    })
    
  }
  //FORM VALIDATIONS

  onChanged = (collaborator) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  onAdd() {
    this.markAsTouched();
    if (!this.disabled) {
      this.onChanged(this.collaborator);
    }
  }

  onRemove() {
    this.markAsTouched();
    if (!this.disabled) {
      this.onChanged(this.collaborator);
    }
  }

  writeValue(collaboratorWritten: Collaborator) {
    this.collaborator = collaboratorWritten;
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
    const collaborator = control.value;
    if (collaborator ==  null) {
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
