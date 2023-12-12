import { License } from "../license/license.model";
import { Service } from "../service/service.model";

export interface CollaboratorForUpdate{
    name: string;
    birthDate?: string;
    email: string;
    password: string;
    phone?: string;
    function: string;
    salary: number;
    commision: number;
    isAdmin: boolean;

    licenses?: License[];
}