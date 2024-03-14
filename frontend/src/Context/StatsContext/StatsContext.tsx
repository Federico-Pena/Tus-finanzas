import { createContext, useContext, useReducer } from 'react'
import { reducerStats } from './reducerStats'
import { StatsContextProps, initialStateStats } from './types'

const initialState: initialStateStats = {
  categoriesStats: [],
  categoriesStatsYear: [],
  categoriesStatsMonth: [],
  dispatch: () => {}
}
const StatsContext = createContext(initialState)

export const StatsContextProvider = ({ children }: StatsContextProps) => {
  const [state, dispatch] = useReducer(reducerStats, initialState)
  const { categoriesStats, categoriesStatsYear, categoriesStatsMonth } = state
  return (
    <StatsContext.Provider
      value={{ categoriesStatsMonth, categoriesStats, categoriesStatsYear, dispatch }}>
      {children}
    </StatsContext.Provider>
  )
}

export const useStatsContext = () => {
  const context = useContext(StatsContext)
  return context
}
