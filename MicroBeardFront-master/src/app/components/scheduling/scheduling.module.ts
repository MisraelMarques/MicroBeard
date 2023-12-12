import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulingCalendarComponent } from './scheduling-calendar/scheduling-calendar.component';
import { SchedulingRoutingModule} from './scheduling-routing.module';

import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SchedulingCreateComponent } from './scheduling-create/scheduling-create.component';
import { SchedulingUpdateComponent } from './scheduling-update/scheduling-update.component';
import { SchedulingDetailsComponent } from './scheduling-details/scheduling-details.component';
import { SchedulingDeleteComponent } from './scheduling-delete/scheduling-delete.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SchedulingContactComponent } from './scheduling-details/scheduling-contact/scheduling-contact.component';
import { SchedulingServiceComponent } from './scheduling-details/scheduling-service/scheduling-service.component';
import { SchedulingCollaboratorComponent } from './scheduling-details/scheduling-collaborator/scheduling-collaborator.component';
import { SchedulingManageServiceComponent } from './scheduling-manage-service/scheduling-manage-service.component';
import { SchedulingManageContactComponent } from './scheduling-manage-contact/scheduling-manage-contact.component';
import { SchedulingManageCollaboratorComponent } from './scheduling-manage-collaborator/scheduling-manage-collaborator.component';




@NgModule({
  imports: [
    SharedModule,
    SchedulingRoutingModule,
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [SchedulingCalendarComponent, SchedulingCreateComponent, SchedulingUpdateComponent, SchedulingDetailsComponent, SchedulingDeleteComponent, SchedulingContactComponent, SchedulingServiceComponent, SchedulingCollaboratorComponent, SchedulingManageServiceComponent, SchedulingManageContactComponent, SchedulingManageCollaboratorComponent],
  exports: [SchedulingCalendarComponent],
})
export class SchedulingModule { }
