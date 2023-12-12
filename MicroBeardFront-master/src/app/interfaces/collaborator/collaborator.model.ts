import { License } from "../license/license.model";
import { Service } from "../service/service.model";

export interface Collaborator{
    code: string;
    name: string;
    birthDate?: Date;
    cpf?: string;
    email: string;
    phone?: string;
    function?: string;
    salary?: number;
    commision?: number;
    isAdmin: boolean;
    creatorCode?: number;
    createDate?: Date;
    updaterCode?: number;
    updateDate?: Date;
    desactivatorCode?: number;
    desactivationDate?: string;

    licenses?: License[];
}