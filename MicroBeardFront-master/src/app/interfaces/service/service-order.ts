import { Order } from "../../enums/order-enum";
import { IOrder } from "../query-string/order";

export interface ServiceOrder extends IOrder {
    Name: {
        Order: Order
        OrderName: string
    };
    Price: {
        Order: Order
        OrderName: string
    };
    CollaboratorCode: {
        Order: Order
        OrderName: string
    };
}