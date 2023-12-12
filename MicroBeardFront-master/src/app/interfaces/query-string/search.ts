export interface ISearch {
    Code: ISearchProperties;
}

export interface ISearchProperties {
    SearchValue: number | string,
    DisplayValue: string,
    ValueType: ISearchType,
}

export enum ISearchType {
    number,
    string
}