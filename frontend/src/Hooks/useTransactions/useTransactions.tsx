import { useState } from 'react'
import { ROUTES } from '../../config/Routes'
import useFetch from '../useFetch/useFetch'
import { useTransactionContext } from '../../Context/TransactionsContext/TransactionContext'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { FormData } from '../../Components/Forms/FormTransaction/types'
dayjs.extend(utc)

const useTransactions = () => {
  const { fetchData } = useFetch()
  const { dispatch, totalCount } = useTransactionContext()
  const [loading, setLoading] = useState(false)

  const addTransaction = async (datos: FormData) => {
    const {
      category,
      amount,
      description,
      isPayment,
      notificationEnabled,
      paymentDueDate,
      date = dayjs()
    } = datos

    let utcPaymentDueDate

    if (notificationEnabled && paymentDueDate) {
      utcPaymentDueDate = dayjs(paymentDueDate)
    } else {
      utcPaymentDueDate = paymentDueDate
    }

    const body = {
      category: category.name,
      amount,
      description,
      isPayment,
      notificationEnabled,
      paymentDueDate: utcPaymentDueDate,
      date
    }

    try {
      setLoading(true)
      const url = ROUTES.TRANSACTIONS.postTransactions
      const { status, data } = await fetchData({ url, method: 'POST', body })
      if (status === 200) {
        dispatch({
          type: 'ADD_NEW_TRANSACTIONS',
          payload: data
        })
        dispatch({
          type: 'ADD_TOTAL_COUNT',
          payload: totalCount + 1
        })
        return true
      }
      return false
    } catch (error) {
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      setLoading(true)
      const url = `${ROUTES.TRANSACTIONS.deleteTransactions}${id}`
      const { status, data } = await fetchData({ url, method: 'DELETE' })
      if (status === 200) {
        dispatch({
          type: 'DELETE_TRANSACTION',
          payload: data
        })
        dispatch({
          type: 'ADD_TOTAL_COUNT',
          payload: totalCount - 1
        })
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const editTransaction = async (datos: FormData, id: string) => {
    const {
      category,
      amount,
      description,
      isPayment,
      notificationEnabled,
      paymentDueDate,
      date = dayjs().utc()
    } = datos
    let utcPaymentDueDate

    if (notificationEnabled && paymentDueDate) {
      utcPaymentDueDate = dayjs(paymentDueDate).utc()
    } else {
      utcPaymentDueDate = paymentDueDate
    }
    const body = {
      category: category.name,
      amount,
      description,
      isPayment,
      notificationEnabled,
      paymentDueDate: utcPaymentDueDate,
      date
    }
    try {
      setLoading(true)
      const url = `${ROUTES.TRANSACTIONS.putTransactions}${id}`
      const { status, data } = await fetchData({ url, method: 'PUT', body })
      if (status === 200) {
        dispatch({
          type: 'ADD_NEW_TRANSACTIONS',
          payload: data
        })
        return true
      }
      return false
    } catch (error) {
      return false
    } finally {
      setLoading(false)
    }
  }
  return {
    addTransaction,
    deleteTransaction,
    editTransaction,
    loading
  }
}

export default useTransactions
