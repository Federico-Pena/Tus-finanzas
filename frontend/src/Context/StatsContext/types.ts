import { Dispatch } from 'react'
import { BarData, GroupedDataItem } from '../../Components/Charts/types'

export interface StatsContextProps {
  children: React.ReactNode
}
export interface CategoryStats {
  _id: {
    category: string
    isPayment: boolean
  }
  totalAmount: number
  count: number
}
export interface TransactionsYearStats {
  _id: {
    month: number
    category: string
    isPayment: boolean
  }
  amount: number
}
export interface initialStateStats {
  categoriesStats: BarData[]
  categoriesStatsYear: GroupedDataItem[]
  categoriesStatsMonth: GroupedDataItem[]
  dispatch: Dispatch<actions>
}
export type actions =
  | { type: 'ADD_CATEGORIES_STATS'; payload: BarData[] }
  | { type: 'ADD_CATEGORIES_STATS_YEAR'; payload: GroupedDataItem[] }
  | { type: 'ADD_CATEGORIES_STATS_MONTH'; payload: GroupedDataItem[] }
