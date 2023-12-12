import { ISearch, ISearchProperties } from "../query-string/search";

export interface ContactSearch extends ISearch {
    Name: ISearchProperties
    Email: ISearchProperties
    Cpf: ISearchProperties
}