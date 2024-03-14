import { CategoryState, actions } from './types'

export const reducerCategories = (state: CategoryState, action: actions) => {
  const { categories } = state
  switch (action.type) {
    case 'ADD_CATEGORIES':
      return {
        ...state,
        categories: action.payload.sort((a, b) => a.name.localeCompare(b.name))
      }
    case 'ADD_NEW_CATEGORY':
      const whitOutNew = categories.filter((c) => c._id !== action.payload._id)
      return {
        ...state,
        categories: [...whitOutNew, action.payload].sort((a, b) => a.name.localeCompare(b.name))
      }
    case 'DELETE_CATEGORY':
      const whitOutDeleted = categories.filter((c) => c._id !== action.payload._id)
      return {
        ...state,
        categories: [...whitOutDeleted].sort((a, b) => a.name.localeCompare(b.name))
      }
    default:
      return state
  }
}
