import { FlatList, StyleSheet, View } from 'react-native'
import CategoryIconItem from '../../CategoryIconItem/CategoryIconItem'
import { CategoryIcon } from '../../CategoryIconItem/types'
import { useCategoriesContext } from '../../../Context/CategoriesContext/CategoriesContext'
import TextComponent from '../../TextComponent/TextComponent'
import { useThemeContext } from '../../../Context/ThemeContext/ThemeContext'
import { getColors } from '../../../theme'
interface FormTransactionCategoriesIconsProps {
  onIconPicked: (category: CategoryIcon) => void
}

const FormTransactionCategories = ({ onIconPicked }: FormTransactionCategoriesIconsProps) => {
  const { categories } = useCategoriesContext()
  const { theme } = useThemeContext()
  const { textColor } = getColors(theme)
  const userCategories = categories.filter((category) => category.isDefault === false)
  return (
    <>
      {userCategories.length > 0 && (
        <>
          <TextComponent bold styles={textColor}>
            Tus categorías
          </TextComponent>
          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={style.contentListContainer}
            data={userCategories}
            horizontal
            renderItem={({ item }) => (
              <CategoryIconItem key={item.name} onIconPicked={onIconPicked} category={item} />
            )}
          />
        </>
      )}
      <TextComponent bold styles={textColor}>
        Categorías por defecto
      </TextComponent>
      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.contentListContainer}
        data={categories.filter((category) => category.isDefault === true)}
        horizontal
        renderItem={({ item }) => (
          <CategoryIconItem key={item.name} onIconPicked={onIconPicked} category={item} />
        )}
      />
    </>
  )
}
export default FormTransactionCategories
const style = StyleSheet.create({
  contentListContainer: {
    columnGap: 10
  }
})
