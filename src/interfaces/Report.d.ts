export interface IReportList {
    current_page: number
    data: IReport[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Link[]
    next_page_url: any
    path: string
    per_page: number
    prev_page_url: any
    to: number
    total: number
  }
  
  export interface IReport {
    id: number
    user_id: number
    store_id: number
    name: string
    type: string
    url: any
    status: number
    created_at: string
    updated_at: string
  }
  
  export interface Link {
    url?: string
    label: string
    active: boolean
  }
  