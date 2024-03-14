import { TransactionState, actions } from './types'

export const reducerTransaction = (state: TransactionState, action: actions) => {
  const { transactions, transactionsFiltered } = state
  switch (action.type) {
    case 'ADD_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload
      }
    case 'ADD_TOTAL_COUNT':
      return {
        ...state,
        totalCount: action.payload
      }
    case 'ADD_NEW_TRANSACTIONS':
      const whitOutPayload = transactions.filter(
        (transaction) => transaction._id !== action.payload._id
      )
      const whitOutPayloadInFilters = transactionsFiltered
        .filter((transaction) => transaction._id !== action.payload._id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return {
        ...state,
        transactions: [...whitOutPayload, action.payload].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
        transactionsFiltered:
          transactionsFiltered.length > 0
            ? [...whitOutPayloadInFilters, action.payload].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
              )
            : []
      }

    case 'DELETE_TRANSACTION':
      const whitOutDelete = transactions
        .filter((transaction) => transaction._id !== action.payload._id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      const whitOutDeleteInFilters = transactionsFiltered
        .filter((transaction) => transaction._id !== action.payload._id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return {
        ...state,
        transactions: whitOutDelete,
        transactionsFiltered: whitOutDeleteInFilters
      }

    case 'FILTER_TRANSACTIONS':
      const { isPayment, category, date } = action.payload
      if (isPayment === undefined && category === undefined && date === undefined) {
        return {
          ...state,
          transactionsFiltered: []
        }
      }
      const filteredTransactions = transactions.filter((transaction) => {
        let condition = true
        if (isPayment !== undefined) {
          condition = condition && transaction.isPayment === isPayment
        }
        if (category !== undefined) {
          condition = condition && transaction.category.name === category
        }
        if (date !== undefined) {
          condition = condition && new Date(transaction.date).toDateString() === date.toDateString()
        }
        return condition
      })
      return {
        ...state,
        transactionsFiltered: filteredTransactions
      }

    default:
      return state
  }
}
