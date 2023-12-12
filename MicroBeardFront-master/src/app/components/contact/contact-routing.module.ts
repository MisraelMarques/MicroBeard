import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactCreateComponent } from './contact-create/contact-create.component';
import { ContactUpdateComponent } from './contact-update/contact-update.component';
import { ContactDeleteComponent } from './contact-delete/contact-delete.component';

const routes: Routes = [
  { path: 'list', component: ContactListComponent },
  { path: 'details/:code', component: ContactDetailsComponent },
  { path: 'create', component: ContactCreateComponent },
  { path: 'update/:code', component: ContactUpdateComponent },
  { path: 'delete/:code', component: ContactDeleteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
