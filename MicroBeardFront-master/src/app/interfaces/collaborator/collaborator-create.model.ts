import { License } from "../license/license.model";
import { Service } from "../service/service.model";

export interface CollaboratorForCreation{
    name: string;
    birthDate?: string;
    cpf?: string;
    email: string;
    password: string;
    phone?: string;
    function: string;
    salary: number;
    commision: number;
    isAdmin: boolean;
    
    licenses?: License[];
}