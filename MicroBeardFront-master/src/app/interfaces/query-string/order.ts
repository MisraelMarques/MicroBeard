import { Order } from "src/app/enums/order-enum";

export interface IOrder {
    Code: {
        Order: Order
        OrderName: string
    };
}