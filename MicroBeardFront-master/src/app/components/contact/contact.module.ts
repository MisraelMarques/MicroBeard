import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactCreateComponent } from './contact-create/contact-create.component';
import { ContactUpdateComponent } from './contact-update/contact-update.component';
import { ContactDeleteComponent } from './contact-delete/contact-delete.component';
import { ContactSchedulingComponent } from './contact-details/contact-scheduling/contact-scheduling.component';

@NgModule({
  declarations: [
    ContactListComponent,
    ContactDetailsComponent,
    ContactCreateComponent,
    ContactUpdateComponent,
    ContactDeleteComponent,
    ContactSchedulingComponent,
  ],
  imports: [
    SharedModule,
    ContactRoutingModule,
  ],
})
export class ContactModule {}
