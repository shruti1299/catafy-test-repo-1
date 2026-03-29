import { ICatalog } from "./Catalog"

export interface IProductList {
  current_page: number
  data: IProduct[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: ILink[]
  next_page_url: any
  path: string
  per_page: number
  prev_page_url: any
  to: number
  total: number
}

export interface IProduct {
  id: number
  user_id: number
  stock: number
  name: string
  image: string
  video: string
  catalog_id: number
  price: string
  unit: string
  unit_value: number
  mrp_price: number
  b2c_price:number
  position: number
  is_stock: number
  is_moa:boolean;
  max_quantity: number
  min_quantity: number
  tax: any
  desc: string
  status: number
  deleted_at: any
  created_at: string
  updated_at: string
  media?: IProductMedia[]
  discounts?: IProductDiscount[]
  variations?: IVariation[]
  tags?: ITag[]
  categories?: IProductCategory[]
  catalogs:ICatalog[]
  catalog_ids?:Number[]
  category_ids?:Number[]
}

export interface ITag {
  id: number
  store_id: number
  name: string
  created_at: string
  updated_at: string
  pivot: Pivot
}

export interface Pivot {
  product_id: number
  tag_id: number
}

export interface IVariation {
  id: number
  product_id: number
  price: number
  b2c_price: number
  mrp_price: number
  stock: number
  attributes?: Record<string, string>
  created_at: string
  updated_at: string
  image:string
  min_quantity:number
}

export interface IAttribute {
  id: number
  attribute_id: number
  value: string
  name:string
  created_at: string
  updated_at: string
}

export interface IProductMedia {
  id: number
  product_id: number
  small: string
  large: string
  type: string
  variation_id:number
}

export interface ILink {
  url?: string
  label: string
  active: boolean
}


export interface IProductDiscount {
  id: number;
  product_id: number
  min_quantity: number
  discount_type: string
  discount_value: string
  created_at: string
  updated_at: string
}

interface IProductCategory {
  id: number
  name: string
  pivot: ICategoryPivot2
}

interface ICategoryPivot2 {
  product_id: number
  store_category_id: number
  created_at: string
  updated_at: string
}
