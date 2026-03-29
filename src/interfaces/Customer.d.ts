import { IOrder } from "./Order"

export interface ICustomer {
  id: number
  name: string
  phone: string
  email: any
  status: 'allowed' | 'rejected' | 'pending';
  created_at:string;
  state: any;
  city: any;
}

export interface ICustomerDetail {
  id: number
  name: string
  email: any
  phone: string
  phone_verified_at: string
  state: any
  city: any
  country: string
  country_code: string
  access_status: 'allowed' | 'rejected' | 'pending';
  address: ICustomerAddress
}

export interface ICustomerAddress {
  id: number
  name: string
  email: string
  phone: string
  address: string
  landmark: any
  state: any
  city: any
  pincode: string
  country_code: string
  country: string
}

export interface ICustomerStats {
  total_order: number,
  total_amount: number,
  recent_orders: IOrder[],
  view: Array<any>
}