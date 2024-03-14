import { ICategory } from '../../../Context/CategoriesContext/types'

export interface FormData {
  category: {
    name: string
    iconName: string
  }
  isDefault: boolean
}
export interface RouteParams {
  category?: ICategory
}
export interface CategoryParams {
  params: ICategory
}
