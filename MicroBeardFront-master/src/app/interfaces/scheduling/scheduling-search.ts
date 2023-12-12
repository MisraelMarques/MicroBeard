import { ISearch, ISearchProperties } from "../query-string/search";

export interface SchedulingSearch extends ISearch {
    ServiceCode: ISearchProperties
    CollaboratorCode: ISearchProperties
    LicenseCode: ISearchProperties
    ContactCode: ISearchProperties
    DateDay: ISearchProperties
    DateMonth: ISearchProperties
    DateYear: ISearchProperties
}