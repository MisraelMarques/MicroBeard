import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CollaboratorRoutingModule } from './collaborator-routing.module';
import { CollaboratorListComponent } from './collaborator-list/collaborator-list.component';
import { CollaboratorDetailsComponent } from './collaborator-details/collaborator-details.component';
import { CollaboratorCreateComponent } from './collaborator-create/collaborator-create.component';
import { CollaboratorUpdateComponent } from './collaborator-update/collaborator-update.component';
import { CollaboratorDeleteComponent } from './collaborator-delete/collaborator-delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollaboratorServiceComponent } from './collaborator-details/collaborator-service/collaborator-service.component';
import { CollaboratorManageLicenseComponent } from './collaborator-manage-license/collaborator-manage-license.component';


@NgModule({
  declarations: [
    CollaboratorListComponent,
    CollaboratorDetailsComponent,
    CollaboratorCreateComponent,
    CollaboratorUpdateComponent,
    CollaboratorDeleteComponent,
    CollaboratorServiceComponent,
    CollaboratorManageLicenseComponent,
  ],
  imports: [
    SharedModule,
    CollaboratorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CollaboratorModule { }
