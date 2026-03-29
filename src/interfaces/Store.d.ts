export interface IStoreDetail {
  user: IUser
  store: IStore
  company: ICompany
  active_plan: IActivePlan
  po_setting:IPOSetting
  detail: IStoreMoreDetail;
}

export interface IStoreMoreDetail{
  description:string
  is_shiprocket:string
  checkout_fields:string[]
  checkout_msg:string
  order_success_msg:string
  is_invoice?:boolean;
  checkout_layout:"center" | "split"
}

export interface IPOSetting {
  store_id: number
  enable_shipping: number
  shipping_cost: any
  enable_packing: number
  packing_cost: any
  enable_tax: number
  tax_percent: any
  created_at: string
  updated_at: string
}

export interface IUser {
  id: number
  name: string
  email: any
  phone: string
  state: any
  city: any
  country: string
  country_code: string
  role:string;
}

export interface IStore {
  theme_id: number
  store_name: string
  logo: any
  p_color: string
  access_type: number
  moa: string
  unit_value:string;
  username:string;
  watermark:boolean;
  meta:Record<string, string|boolean>
  product_grid:number;
  catalog_grid:number;
  container_size:number;
  cc_size:number;
  enquiry_type:string;
  is_b2c:boolean;
  b2c_domain:string;
  is_section:boolean;
  is_variation:boolean;
}

export interface ICompany {
  id: number
  user_id: number
  company: string
  address: any
  pincode: any
  city: any
  state: any
  country: any
  gst: any
  pan: any
  created_at: any
  updated_at: any
  meta:any;
}

export interface IActivePlan {
  id: number;
  plan_id:number;
  plan_name?:string;
  rz_subscription_id: string;
  rz_plan_id: string;
  status: string;
  start_at: string | null;
  end_at: string | null;
  next_charge_at: string | null;
  total_cycles: number | null;
  last_payment_at: string | null;
}

export interface ITheme {
  id: number
  config: any[]
  status: number
  primary_color: string
  secondary_color: string
  bg_color: string
  image: any
}