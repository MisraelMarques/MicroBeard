import { IOrder } from "./order";
import { IPagination } from "./pagination";
import { ISearch } from "./search";

export interface IQueryString<TSearch extends ISearch, TOrder extends IOrder> {
    Search: TSearch;
    Ordination: TOrder
    Pagination: IPagination;
}