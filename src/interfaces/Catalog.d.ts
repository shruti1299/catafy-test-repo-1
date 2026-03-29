export interface ICatalogList {
  current_page: number
  data: ICatalog[]
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

export interface ICatalog {
  id: number
  name: string
  image?: string
  visibilty: number
  status: number
  created_at: string;
  products_count?:number;
  description:string;
  is_excerpt:boolean;
}

export interface ILink {
  url?: string
  label: string
  active: boolean
}
