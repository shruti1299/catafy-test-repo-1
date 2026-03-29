import { ICustomer } from "./Customer"

export interface IOrderList {
  current_page: number
  data: IOrder[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: ILink[]
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: any
  to: number
  total: number
}

export interface IOrder {
  id: number
  s_no?: string
  gatway_id: any
  user_id: number
  customer_id: number
  shipping_id: number
  billing_id: number
  coupon_id: any
  subtotal: string
  tax: string
  discount: string
  shipping_charge: string
  packing_charge?: string
  total: string
  order_datetime: string
  payment_method: number
  payment_status: number
  payment_tid: any
  payment_at: string
  status: number
  remarks?: string
  items_count?: number
  customer?: ICustomer
  items?: IItem[]
  order_address: IOrderAddress
  channel: "b2b" | "b2c"
  shipping_txt_id: string
  invoice_no?: string | null
  invoice_pdf_path?: string | null
  is_seller_modified?: boolean
}

export interface IOrderItem {
  id: number
  order_id: number
  product_id: number
  variation_id?: number | null | undefined
  quantity: number
  name: any
  thumb: string
  price: string
  msg: string
  unit_price: number
  discount_type: number
  discount_value: number
  variation_data?: IVariationData
  original_price?: string | null
  original_quantity?: number | null
}

export interface IVariationData {
  id: number
  price: string
  sku: any
  attrs: IAttrs
}

export interface IAttrs {
  Size: string
  Color: string
}


export interface IOrderAddress {
  id: number
  customer_id: number
  order_id: number
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
  created_at: string
  updated_at: string
}

export interface ILink {
  url?: string
  label: string
  active: boolean
}
