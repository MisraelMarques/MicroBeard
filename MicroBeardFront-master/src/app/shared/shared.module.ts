import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule} from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { NgxMaskModule } from 'ngx-mask';

import { ErrorModalComponent } from './modals/error-modal/error-modal.component';
import { SuccessModalComponent } from './modals/success-modal/success-modal.component';

import { AppendDirective } from './directives/append.directive';
import { DatePipe } from '@angular/common';
import { CpfCnpjPipe } from './pipes/cpf-cnpj.pipe';
import { PhonePipe } from './pipes/phone.pipe';
import { ServiceAddModalComponent } from './modals/service-add-modal/service-add-modal.component';
import { ContactAddModalComponent } from './modals/contact-add-modal/contact-add-modal.component';
import { CollaboratorAddModalComponent } from './modals/collaborator-add-modal/collaborator-add-modal.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { SearchComponent } from '../components/search/search.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SchedulingDeleteModalComponent } from './modals/scheduling-delete-modal/scheduling-delete-modal.component';



@NgModule({
  declarations: [
    ErrorModalComponent,
    SuccessModalComponent,
    AppendDirective,
    CpfCnpjPipe,
    PhonePipe,
    ServiceAddModalComponent,
    ContactAddModalComponent,
    CollaboratorAddModalComponent,
    PaginationComponent,
    SearchComponent,
    SchedulingDeleteModalComponent
  ],
  imports: [
    ModalModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    TimepickerModule.forRoot(),
  ],
  exports: [
    TimepickerModule,
    CommonModule,
    NgbModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    NgxMaskModule,
    ErrorModalComponent,
    SuccessModalComponent,
    CpfCnpjPipe,
    PhonePipe,
    PaginationComponent,
    SearchComponent
  ],
  providers: [
    DatePipe,
  ]
})
export class SharedModule { }
