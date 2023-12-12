import { ISearch, ISearchProperties } from "../query-string/search";

export interface CollaboratorSearch extends ISearch {
    Name: ISearchProperties
    Email: ISearchProperties
    Cpf: ISearchProperties
    ServiceCode: ISearchProperties
}