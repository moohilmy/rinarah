import { TItem, TOrder } from "./OrderType"

type Tbilling = TOrder['shipping']
export type TEmail ={
    customerName: string,
    orderId: string,
    orderDate: string,
    shipping: number,
    subtotal: number,
    tax: number,
    paymentMethod: string,
    total: number,
    customerEmail: string
    billing: Tbilling,
    items: TItem[]
}