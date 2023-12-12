import { ISearch, ISearchProperties } from "../query-string/search";

export interface ServiceSearch extends ISearch {
    Name: ISearchProperties
    CollaboratorCode: ISearchProperties
}