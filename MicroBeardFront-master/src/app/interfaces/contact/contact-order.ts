import { Order } from "../../enums/order-enum";
import { IOrder } from "../query-string/order";

export interface ContactOrder extends IOrder {
    Name: {
        Order: Order
        OrderName: string
    };
    Email: {
        Order: Order
        OrderName: string
    };
    Cpf: {
        Order: Order
        OrderName: string
    };
}