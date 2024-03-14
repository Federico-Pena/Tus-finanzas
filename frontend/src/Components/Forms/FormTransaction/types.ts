import { ITransaction } from '../../../Context/TransactionsContext/types'

export interface FormData {
  amount: number
  description: string
  category: {
    name: string
    iconName: string
  }
  isPayment: boolean
  paymentDueDate?: Date
  date?: Date
  notificationEnabled: boolean
}

export interface RouteParams {
  transaction?: ITransaction
}
export interface NotificationSwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
}
