import { Order } from "../../enums/order-enum";
import { IOrder } from "../query-string/order";

export interface SchedulingOrder extends IOrder{
    ServiceCode: {
        Order: Order
        OrderName: string
    };
    CollaboratorCode: {
        Order: Order
        OrderName: string
    };
    LicenseCode: {
        Order: Order
        OrderName: string
    };
    ContactCode: {
        Order: Order
        OrderName: string
    };
    DateDay: {
        Order: Order
        OrderName: string
    };
    DateMonth: {
        Order: Order
        OrderName: string
    };
    DateYear: {
        Order: Order
        OrderName: string
    };
}