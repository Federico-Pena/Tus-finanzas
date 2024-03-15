import React, { useEffect, useState } from 'react'
import { useStatsContext } from '../../Context/StatsContext/StatsContext'
import useFetch from '../useFetch/useFetch'
import { ROUTES } from '../../config/Routes'
import { statsHistoryFormat } from './helpers/statsHistoryFormat'
import { groupData } from './helpers/statsYearFormat'
import { useTransactionContext } from '../../Context/TransactionsContext/TransactionContext'
import { groupDataByDay } from './helpers/statsMonthFormat'

interface YearAndMonth {
  year: number
  month: number
}
const useStats = (year: number, yearAndMonth: YearAndMonth) => {
  const [loading, setLoading] = useState(false)
  const [loadingYear, setLoadingYear] = useState(false)
  const [loadingMonth, setLoadingMonth] = useState(false)
  const { dispatch } = useStatsContext()
  const { fetchData } = useFetch()
  const { transactions } = useTransactionContext()
  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      try {
        const url = ROUTES.STATS.getCategoriesStats
        const { status, data } = await fetchData({ url, method: 'GET' })
        if (status === 200) {
          const formatData = statsHistoryFormat(data)
          dispatch({
            type: 'ADD_CATEGORIES_STATS',
            payload: formatData
          })
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
    getCategories()
  }, [transactions])

  useEffect(() => {
    const getCategoriesYear = async () => {
      setLoadingYear(true)
      try {
        const url = `${ROUTES.STATS.getCategoriesStatsYear}${year}`
        const { status, data } = await fetchData({ url, method: 'GET' })
        if (status === 200) {
          const groupedResult = groupData(data)
          dispatch({
            type: 'ADD_CATEGORIES_STATS_YEAR',
            payload: groupedResult
          })
        }
      } catch (error) {
      } finally {
        setLoadingYear(false)
      }
    }
    getCategoriesYear()
  }, [year, transactions])

  useEffect(() => {
    const getCategoriesMonth = async () => {
      let month
      setLoadingMonth(true)
      try {
        if (yearAndMonth.month < 10) {
          month = `0${yearAndMonth.month}`
        } else {
          month = yearAndMonth.month
        }
        const url = `${ROUTES.STATS.getCategoriesStatsMonth}${yearAndMonth.year}/${month}`
        const { status, data } = await fetchData({ url, method: 'GET' })

        if (status === 200) {
          const formatDays = groupDataByDay(data)
          dispatch({
            type: 'ADD_CATEGORIES_STATS_MONTH',
            payload: formatDays
          })
        }
      } catch (error) {
        // Handle error
      } finally {
        setLoadingMonth(false)
      }
    }
    getCategoriesMonth()
  }, [yearAndMonth, transactions])
  return {
    loading,
    loadingYear,
    loadingMonth
  }
}

export default useStats
