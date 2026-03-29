export interface IWhatsappData {
  events: IEvent[]
  credit: IStoreCredit
  automations: IAutomation[]
}

export interface IEvent {
  id: number
  event_key: string
  name: string
  category: string
  price: string
  description: string
  created_at: string
  updated_at: string
  templates: any[]
}

export interface IAutomation {
  id: number
  store_id: number
  event_id: number
  template_id: any
  enabled: boolean
  price: string
  created_at: string
  updated_at: string
}

export interface IStoreCredit {
  id: number
  store_id: number
  balance: number
  used: number
  sent_today?:number
  created_at: string
  updated_at: string
}
