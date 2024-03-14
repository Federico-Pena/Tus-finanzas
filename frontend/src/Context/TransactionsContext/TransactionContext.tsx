import { createContext, useContext, useReducer } from 'react'
import { TransactionProps, TransactionState } from './types'
import { reducerTransaction } from './reducerTransaction'

const initialState: TransactionState = {
  transactions: [],
  transactionsFiltered: [],
  totalCount: 0,
  dispatch: () => {}
}

const TransactionContext = createContext(initialState)
export const TransactionContextProvider = ({ children }: TransactionProps) => {
  const [state, dispatch] = useReducer(reducerTransaction, initialState)
  const { transactions, transactionsFiltered, totalCount } = state
  return (
    <TransactionContext.Provider
      value={{ transactions, transactionsFiltered, totalCount, dispatch }}>
      {children}
    </TransactionContext.Provider>
  )
}
export const useTransactionContext = () => {
  const context = useContext(TransactionContext)
  return context
}
