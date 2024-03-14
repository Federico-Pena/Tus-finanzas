import { TransactionsYearStats } from '../../Context/StatsContext/types'

export interface CHART_CATEGORY_PROPS {
  data: BarData[]
}
export interface BarData {
  value: number
  label?: string
  frontColor?: string
  sideColor?: string
  topColor?: string
}
export interface CHART_YEAR_PROPS {
  data: GroupedDataItem[]
}

export interface StackItem {
  value: number
  color?: string
  label?: string
  isPayment?: boolean
  marginBottom?: number
}

export interface GroupedDataItem {
  label: string
  stacks: StackItem[]
}

/* {"_id": 3, "totalAmountExpenses": 3000, "totalAmountPayments": 4000} */
