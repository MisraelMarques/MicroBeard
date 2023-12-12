import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CollaboratorListComponent } from './collaborator-list/collaborator-list.component';
import { CollaboratorDetailsComponent } from './collaborator-details/collaborator-details.component';
import { CollaboratorCreateComponent } from './collaborator-create/collaborator-create.component';
import { CollaboratorUpdateComponent } from './collaborator-update/collaborator-update.component';
import { CollaboratorDeleteComponent } from './collaborator-delete/collaborator-delete.component';

const routes: Routes = [
  { path: 'list', component: CollaboratorListComponent },
  { path: 'details/:code', component: CollaboratorDetailsComponent },
  { path: 'create', component: CollaboratorCreateComponent },
  { path: 'update/:code', component: CollaboratorUpdateComponent },
  { path: 'delete/:code', component: CollaboratorDeleteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollaboratorRoutingModule { }
