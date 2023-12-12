import { Scheduling } from "../scheduling/scheduling.model";

export interface Contact {
  code: string;
  name: string;
  address?: string;
  email: string;
  cpf?: string;
  phone?: string;
  gender?: string;
  birthDate?: Date;
  creatorCode?: number;
  createDate?: string;
  updaterCode?: number;
  updateDate?: string;
  deleterCode?: number;
  deleteDate?: string;

  schedulings?: Scheduling[];
}
