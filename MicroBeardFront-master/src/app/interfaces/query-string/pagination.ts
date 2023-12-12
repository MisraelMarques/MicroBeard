export interface IPagination {
    TotalCount: number;
    CurrentPage: number;
    PageSize: number;
    TotalPages: number;
    HasNext: number;
    HasPrevious: number;
}