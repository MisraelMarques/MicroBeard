import { Injectable } from '@angular/core';
import { Order } from 'src/app/enums/order-enum';
import { IOrder } from 'src/app/interfaces/query-string/order';
import { IPagination } from 'src/app/interfaces/query-string/pagination';
import { IQueryString } from 'src/app/interfaces/query-string/query-string';
import { ISearch } from 'src/app/interfaces/query-string/search';


@Injectable({
    providedIn: 'root',
})

export class QueryStringHelper<TSearch extends ISearch, TOrder extends IOrder> {
    constructor() {}
    
    public writeQueryStrings = (queryStringObject: IQueryString<ISearch, IOrder>) : string =>{
        var searchQuery = this.writeSearchQuery(queryStringObject.Search)

        var orderByQuery = this.writeOrderByQuery(queryStringObject.Ordination);    
        if(searchQuery != '')
            orderByQuery = "&" + orderByQuery
        
        var paginationQuery = this.writePaginationQuery(queryStringObject.Pagination)
        if(searchQuery != '' || orderByQuery != '')
            paginationQuery = "&" + paginationQuery
        
        var queryString = searchQuery  + orderByQuery + paginationQuery;
        if(queryString != ''){
            queryString = '?' + queryString;
        }
        console.log(queryString);
        return queryString;
    } 

    private writeSearchQuery = (query : ISearch) : string  => {
        console.log("SEARCH",query);
        var queryString = '';
        var hasAddedOtherOrdination = false

        Object.entries(query).forEach(([key, value]) => {
            if(value != null){
                if(value.SearchValue !== null && value.SearchValue !== ''){
                    if(hasAddedOtherOrdination){
                        queryString += ',';
                    }
                    
                    queryString += key + '=' + value.SearchValue;
    
                    hasAddedOtherOrdination = true;
                }
            }
        })
        return queryString;
    }

    private writeOrderByQuery = (query : IOrder) : string  => {
        var queryString = ''
        var hasAddedOtherOrdination = false

        Object.entries(query).forEach(([key, value]) => {
            if(value["Order"] != 0){
                if(hasAddedOtherOrdination){
                    queryString += ',';
                }

                queryString += `${value["OrderName"]} ${Order[value["Order"]]}`

                hasAddedOtherOrdination = true;
            }
        })

        if(queryString != ''){
            queryString = 'OrderBy=' + queryString;
        }

        return queryString;
    }

    private writePaginationQuery = (query: IPagination) : string  => {
        var queryString = ''
        var hasAddedOther = false

        if(query.CurrentPage != null){
            queryString += `currentPage=${query.CurrentPage}`;
            hasAddedOther = true
        }

        if(query.PageSize != null){
            if(hasAddedOther){
                queryString += '&'
            }
            queryString += `pageSize=${query.PageSize}`;
        }

        return queryString;
    }

    public updateQueryStringOrdination = (Ordination: string, queryStringObject: IQueryString<ISearch, IOrder> ) =>{
        Object.entries(queryStringObject.Ordination).forEach(([key, value]) => {
            if(key != Ordination){
                value["Order"] = Order.none
            }
        })

        var currentOrdination = queryStringObject.Ordination[`${Ordination}`]
        currentOrdination.Order = (currentOrdination.Order + 1)%3
        return queryStringObject;
    }
}