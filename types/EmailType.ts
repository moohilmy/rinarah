import { TItem, TOrder } from "./OrderType"

type Tbilling = Pick<TOrder, 'shipping'>
export type TEmail ={
    customerName: string,
    orderId: string,
    orderDate: string,
    subtotal: string | number,

    tax: number,

    paymentMethod: string,
    total: number,
    customerEmail: string
    billing: Tbilling,
    items: TItem[]
}