import { IProduct } from "./Product"

export interface ICategoryData {
  current_page: number
  data: IStoreCategory[]
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

export interface IStoreCategory {
  id: number
  store_id: number
  name: string
  slug: string
  parent_id: any
  enabled: boolean
  created_at: string
  updated_at: string
  children: any
  products?:IProduct[]
}

interface IChild{
  id:number;
  name:string;
  parent_id:number
}

interface ILink {
  url?: string
  label: string
  active: boolean
}
