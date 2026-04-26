export interface RevenueData {
  totalRevenue: number
  chart: {
    date: string
    total: number
  }[]
}

export interface OrderStatsData {
  stats: {
    PENDING: number
    CONFIRMED: number
    SHIPPING: number
    COMPLETED: number
    CANCELLED: number
  }
  percentages: {
    PENDING: number
    CONFIRMED: number
    SHIPPING: number
    COMPLETED: number
    CANCELLED: number
  }
  total: number
  summary: {
    completed: number
    cancelled: number
    pending: number
  }
}