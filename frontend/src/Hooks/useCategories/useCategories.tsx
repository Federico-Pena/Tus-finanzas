import useFetch from '../useFetch/useFetch'
import { ROUTES } from '../../config/Routes'
import { FormData } from '../../Components/Forms/FormCategory/types'
import { useCategoriesContext } from '../../Context/CategoriesContext/CategoriesContext'
import { useTransactionContext } from '../../Context/TransactionsContext/TransactionContext'
import { useState } from 'react'

const useCategories = () => {
  const { fetchData } = useFetch()
  const { dispatch } = useCategoriesContext()
  const { dispatch: dispatchTransactions, transactions } = useTransactionContext()
  const [loading, setLoading] = useState(false)
  const getCategories = async () => {
    setLoading(true)
    try {
      const url = ROUTES.CATEGORIES.getCategories
      console.log(url)

      const { status, data } = await fetchData({ url, method: 'GET' })
      if (status === 200) {
        dispatch({
          type: 'ADD_CATEGORIES',
          payload: data
        })
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  const addCategory = async (datos: FormData) => {
    try {
      setLoading(true)
      const { category, isDefault } = datos
      const { iconName, name } = category
      const url = ROUTES.CATEGORIES.postCategories
      const { status, data } = await fetchData({
        url,
        method: 'POST',
        body: { isDefault, iconName, name }
      })
      if (status === 200) {
        dispatch({
          type: 'ADD_NEW_CATEGORY',
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
  const editCategory = async (datos: FormData, id: string) => {
    try {
      setLoading(true)
      const { category, isDefault } = datos
      const { iconName, name } = category
      const url = `${ROUTES.CATEGORIES.putCategories}${id}`
      const { status, data } = await fetchData({
        url,
        method: 'PUT',
        body: { isDefault, iconName, name }
      })
      if (status === 200) {
        dispatch({
          type: 'ADD_NEW_CATEGORY',
          payload: data
        })
        const updatedTransactions = transactions.map((transaction) => {
          if (transaction.category._id === data._id) {
            transaction.category = data
            return transaction
          } else {
            return transaction
          }
        })
        dispatchTransactions({
          type: 'ADD_TRANSACTIONS',
          payload: updatedTransactions
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
  const deleteCategory = async (id: string) => {
    try {
      setLoading(true)
      const url = `${ROUTES.CATEGORIES.deleteCategories}${id}`
      const { status, data } = await fetchData({
        url,
        method: 'DELETE'
      })
      if (status === 200) {
        dispatch({
          type: 'DELETE_CATEGORY',
          payload: data
        })
        const updatedTransactions = transactions.filter(
          (transaction) => transaction.category._id !== data._id
        )
        dispatchTransactions({
          type: 'ADD_TRANSACTIONS',
          payload: updatedTransactions
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
  return { getCategories, addCategory, deleteCategory, editCategory, loading }
}

export default useCategories
