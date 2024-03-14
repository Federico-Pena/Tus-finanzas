import { Dispatch } from 'react'

export interface ICategory {
  _id: string
  user: { _id: string; username: string }
  name: string
  iconName: string
  isDefault: boolean
}

export interface CategoryProps {
  children: React.ReactNode
}
export interface CategoryState {
  categories: ICategory[]
  dispatch: Dispatch<actions>
}
export type actions =
  | { type: 'ADD_CATEGORIES'; payload: ICategory[] }
  | { type: 'ADD_NEW_CATEGORY'; payload: ICategory }
  | { type: 'DELETE_CATEGORY'; payload: ICategory }
