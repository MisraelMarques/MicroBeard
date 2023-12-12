import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulingCalendarComponent } from './scheduling-calendar/scheduling-calendar.component';
import { SchedulingCreateComponent } from './scheduling-create/scheduling-create.component';
import { SchedulingDeleteComponent } from './scheduling-delete/scheduling-delete.component';
import { SchedulingDetailsComponent } from './scheduling-details/scheduling-details.component';
import { SchedulingUpdateComponent } from './scheduling-update/scheduling-update.component';


const routes: Routes = [
  { path: 'calendar', component: SchedulingCalendarComponent },
  { path: 'details/:code', component: SchedulingDetailsComponent },
  { path: 'update/:code', component: SchedulingUpdateComponent },
  { path: 'delete/:code', component: SchedulingDeleteComponent },
  { path: 'create', component: SchedulingCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulingRoutingModule { }
