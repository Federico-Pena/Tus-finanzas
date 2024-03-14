import { Dispatch } from 'react'

export interface ITransaction {
  _id: string
  user: string
  category: { _id: string; name: string; iconName: string }
  amount: number
  description: string
  date: Date
  isPayment: boolean
  paymentDueDate?: Date
  notificationEnabled: boolean
}

export interface TransactionProps {
  children: React.ReactNode
}
export interface TransactionState {
  transactions: ITransaction[]
  transactionsFiltered: ITransaction[]
  totalCount: number
  dispatch: Dispatch<actions>
}

type FilterPayload = {
  isPayment?: ITransaction['isPayment']
  date?: ITransaction['date']
  category?: ITransaction['category']['name']
}
export type actions =
  | { type: 'ADD_TRANSACTIONS'; payload: ITransaction[] }
  | { type: 'ADD_TOTAL_COUNT'; payload: number }
  | { type: 'ADD_NEW_TRANSACTIONS'; payload: ITransaction }
  | { type: 'DELETE_TRANSACTION'; payload: ITransaction }
  | { type: 'FILTER_TRANSACTIONS'; payload: FilterPayload }
