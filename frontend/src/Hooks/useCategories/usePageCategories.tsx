import { useEffect, useState } from 'react'
import useFetch from '../useFetch/useFetch'
import { useCategoriesContext } from '../../Context/CategoriesContext/CategoriesContext'
import { ROUTES } from '../../config/Routes'

const usePageCategories = () => {
  const { fetchData } = useFetch()
  const { dispatch } = useCategoriesContext()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      try {
        const url = ROUTES.CATEGORIES.getCategories
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
    getCategories()
  }, [])
  return { loading }
}

export default usePageCategories
