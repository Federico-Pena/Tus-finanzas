import { actions, initialStateStats } from './types'

export const reducerStats = (state: initialStateStats, action: actions) => {
  switch (action.type) {
    case 'ADD_CATEGORIES_STATS':
      return {
        ...state,
        categoriesStats: action.payload
      }
    case 'ADD_CATEGORIES_STATS_YEAR':
      return {
        ...state,
        categoriesStatsYear: action.payload
      }
    case 'ADD_CATEGORIES_STATS_MONTH':
      return {
        ...state,
        categoriesStatsMonth: action.payload
      }
    default:
      return state
  }
}
