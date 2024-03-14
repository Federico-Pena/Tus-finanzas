import React, { createContext, useContext, useReducer } from 'react'
import { reducerCategories } from './reducerCategories'
import { CategoryProps, CategoryState } from './types'

const initialState: CategoryState = {
  categories: [],
  dispatch: () => {}
}

const CategoriesContext = createContext(initialState)
export const CategoriesContextProvider = ({ children }: CategoryProps) => {
  const [state, dispatch] = useReducer(reducerCategories, initialState)
  const { categories } = state
  return (
    <CategoriesContext.Provider value={{ categories, dispatch }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export const useCategoriesContext = () => {
  const context = useContext(CategoriesContext)
  return context
}
