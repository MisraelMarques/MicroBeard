import { Collaborator } from "../collaborator/collaborator.model";
import { Contact } from "../contact/contact.model";
import { License } from "../license/license.model";
import { Service } from "../service/service.model";

export interface Scheduling {
  code?: string;
  title: string;
  date: Date;
  endDate: Date;
  licenseCode: number;
  contactCode: number;
  cancelled?: boolean;
  cancellerCode?: number;
  cancellationDate?: string;
  creatorCode?: number;
  createDate?: string;
  updaterCode?: number;
  updateDate?: string;

  contact?: Contact;
  license?: License;
}
