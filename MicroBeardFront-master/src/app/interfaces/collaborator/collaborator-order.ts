import { Order } from "../../enums/order-enum";
import { IOrder } from "../query-string/order";

export interface CollaboratorOrder extends IOrder{
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
    ServiceCode: {
        Order: Order
        OrderName: string
    };
}