import { useEffect, useState } from 'react'
import { useTransactionContext } from '../../Context/TransactionsContext/TransactionContext'
import useFetch from '../useFetch/useFetch'
import { ROUTES } from '../../config/Routes'

const usePageTransactions = () => {
  const { fetchData } = useFetch()
  const { dispatch, transactions } = useTransactionContext()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true)
      try {
        const url = `${ROUTES.TRANSACTIONS.getTransactions}?page=${page}`
        const { status, data } = await fetchData({ url, method: 'GET' })
        if (status === 200) {
          const { transactions, page: p, totalCount, totalPages } = data
          dispatch({
            type: 'ADD_TRANSACTIONS',
            payload: transactions
          })
          dispatch({
            type: 'ADD_TOTAL_COUNT',
            payload: totalCount
          })
          setPage(p)
          setTotalPages(totalPages)
        } else {
          dispatch({
            type: 'ADD_TRANSACTIONS',
            payload: []
          })
          dispatch({
            type: 'ADD_TOTAL_COUNT',
            payload: 0
          })
          setPage(page)
          setTotalPages(totalPages)
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
    getTransactions()
  }, [page])

  const changePage = (newPage: number) => {
    setPage(newPage)
  }

  return {
    page,
    totalPages,
    changePage,
    loading
  }
}

export default usePageTransactions
