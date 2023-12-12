import { Collaborator } from "../collaborator/collaborator.model";
import { Scheduling } from "../scheduling/scheduling.model";
import { Service } from "../service/service.model";

export interface License {
  code?: string;
  serviceCode?: number;
  collaboratorCode?: number;

  collaborator?: Collaborator;
  service?: Service;
  schedulings?: Scheduling[];
}
