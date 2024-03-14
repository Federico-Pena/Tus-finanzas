import { useEffect, useState } from 'react'
import { useTransactionContext } from '../../Context/TransactionsContext/TransactionContext'
import useFetch from '../useFetch/useFetch'
import { RUTES } from '../../config/Rutes'

const usePageTransactions = () => {
  const { fetchData } = useFetch()
  const { dispatch } = useTransactionContext()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true)
      try {
        const url = `${RUTES.TRANSACTIONS.getTransactions}?page=${page}`
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
