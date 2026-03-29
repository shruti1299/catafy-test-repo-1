export interface IPlan {
  id: number;
  rz_plan_id: string;
  name: string; // Starter | Growth | Scale
  price: string;
  billing_cycle: IBillingCycle;
  description: string;
  devices: number;
  products: number;
  catalogs: number;
  categories: number;
}

export interface IPlanUsages {
  orders: number
  products: number
  catalogs: number
  categories: number
  teams: number
  active_plan: IPlanRawData
}

export interface IPlanRawData {
  id: number
  rz_plan_id: string
  name: string
  price: string
  billing_cycle: string
  description: string
  devices: number
  products: number
  catalogs: number
  categories: number
  updated_at: any
  created_at: any
}


export type IBillingCycle = 'monthly' | 'quarterly' | 'yearly';