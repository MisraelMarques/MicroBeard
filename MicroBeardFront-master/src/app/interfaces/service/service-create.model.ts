import { Collaborator } from "../collaborator/collaborator.model";
import { Scheduling } from "../scheduling/scheduling.model";
import { License } from "../license/license.model";

export interface ServiceForCreation{
  name: string;
  price: number;
  time: number;
  type: string;
  description: string;

  licenses?: License[];
}