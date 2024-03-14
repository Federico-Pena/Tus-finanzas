import { FlatList, StyleSheet } from 'react-native'
import CategoryIconItem from '../../CategoryIconItem/CategoryIconItem'
import { CategoryIcon } from '../../CategoryIconItem/types'
import { useCategoriesContext } from '../../../Context/CategoriesContext/CategoriesContext'
interface FormTransactionCategoriesIconsProps {
  onIconPicked: (category: CategoryIcon) => void
}

const FormTransactionCategories = ({ onIconPicked }: FormTransactionCategoriesIconsProps) => {
  const { categories } = useCategoriesContext()
  return (
    <FlatList
      style={style.container}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={style.contentListContainer}
      data={categories}
      horizontal
      renderItem={({ item }) => (
        <CategoryIconItem key={item.name} onIconPicked={onIconPicked} category={item} />
      )}
    />
  )
}
export default FormTransactionCategories
const style = StyleSheet.create({
  container: {
    width: '100%'
  },
  contentListContainer: {
    paddingVertical: 10,
    gap: 10,
    justifyContent: 'space-between'
  }
})
