import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServiceCreateComponent } from './service-create/service-create.component';
import { ServiceUpdateComponent } from './service-update/service-update.component';
import { ServiceDeleteComponent } from './service-delete/service-delete.component';

const routes: Routes = [
  { path: 'list', component: ServiceListComponent },
  { path: 'details/:code', component: ServiceDetailsComponent },
  { path: 'create', component: ServiceCreateComponent },
  { path: 'update/:code', component: ServiceUpdateComponent },
  { path: 'delete/:code', component: ServiceDeleteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
