import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'

import TextComponent from '../TextComponent/TextComponent'
import { ICategory } from '../../Context/CategoriesContext/types'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import useCategories from '../../Hooks/useCategories/useCategories'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RoutesStackList } from '../Navigation/types'
import { useUserContext } from '../../Context/UserContext/UserContext'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'
import { THEME, getColors } from '../../theme'

const CategoryScreenItem = ({ name, iconName, _id, isDefault, user }: ICategory) => {
  const { theme } = useThemeContext()
  const { textColor } = getColors(theme)
  const navigation = useNavigation<StackNavigationProp<RoutesStackList>>()
  const { userData } = useUserContext()
  const role = userData?.user.role
  const isAdmin = role && role === 'admin'

  const { deleteCategory } = useCategories()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false)

  const category = { name, iconName, _id, isDefault, user }
  const openModalDelete = () => {
    setModalVisible(true)
  }
  const openModalEdit = () => {
    setModalVisibleEdit(true)
  }
  const handleEditCategory = (boolean: boolean) => {
    if (boolean) {
      navigation.navigate('FormCategoryScreen', {
        category: category
      })
      setModalVisibleEdit(false)
    } else {
      setModalVisibleEdit(false)
    }
  }

  const handleDeleteCategory = async (boolean: boolean) => {
    if (boolean) {
      await deleteCategory(_id)
      setModalVisible(false)
    } else {
      setModalVisible(false)
    }
  }
  return (
    <View style={styles.container}>
      <ConfirmModal
        isVisible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleDeleteCategory}
        question={`Desea eliminar la categoría ${category.name}? Se eliminaran las transacciones asociadas a esta categoría`}
      />
      <ConfirmModal
        isVisible={modalVisibleEdit}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleEditCategory}
        question={`Esto afectara las transacciones asociadas a esta categoría. Desea continuar?`}
      />
      {isAdmin === true ? (
        <View style={[styles.card, theme === 'dark' && styles.borderCardDark]}>
          <View style={styles.cardRow}>
            <View style={styles.containerCardButtons}>
              <MaterialIcons
                categoryName={name}
                name={iconName as keyof typeof MaterialIcons.glyphMap}
                size={24}
                color={theme === 'dark' ? '#fff' : 'black'}
              />
              <TextComponent styles={textColor}>{name}</TextComponent>
            </View>
            <View style={styles.containerCardButtons}>
              <TouchableOpacity onPress={openModalEdit}>
                <MaterialIcons name='edit' size={20} color={theme === 'dark' ? '#fff' : 'black'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={openModalDelete}>
                <MaterialIcons
                  name='delete'
                  size={20}
                  color={theme === 'dark' ? '#fff' : 'black'}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardRow}>
            <TextComponent styles={textColor}>Categoría por defecto</TextComponent>
            <TextComponent styles={textColor}>{isDefault ? 'Si' : 'No'}</TextComponent>
          </View>
          <View style={styles.cardRow}>
            <TextComponent styles={textColor}>Usuario</TextComponent>
            <TextComponent styles={textColor}>{user.username}</TextComponent>
          </View>
        </View>
      ) : (
        !isDefault && (
          <View style={[styles.card, theme === 'dark' && styles.borderCardDark]}>
            <View style={styles.cardRow}>
              <View style={styles.containerCardButtons}>
                <MaterialIcons
                  categoryName={name}
                  name={iconName as keyof typeof MaterialIcons.glyphMap}
                  size={24}
                  color={theme === 'dark' ? '#fff' : 'black'}
                />
                <TextComponent styles={textColor}>{name}</TextComponent>
              </View>
              <View style={styles.containerCardButtons}>
                <TouchableOpacity onPress={openModalEdit}>
                  <MaterialIcons
                    name='edit'
                    size={20}
                    color={theme === 'dark' ? '#fff' : 'black'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={openModalDelete}>
                  <MaterialIcons
                    name='delete'
                    size={20}
                    color={theme === 'dark' ? '#fff' : 'black'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      )}
    </View>
  )
}

export default CategoryScreenItem
const styles = StyleSheet.create({
  container: {},
  card: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    rowGap: 10
  },
  borderCardDark: {
    borderColor: THEME.colors.themeDark.Text
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  containerCardButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 5
  }
})
