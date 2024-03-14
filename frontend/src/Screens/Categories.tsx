import React from 'react'
import Layout from '../Components/Layout/Layout'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import useCategories from '../Hooks/useCategories/useCategories'
import { useCategoriesContext } from '../Context/CategoriesContext/CategoriesContext'
import { TouchableOpacity } from 'react-native-gesture-handler'
import TextComponent from '../Components/TextComponent/TextComponent'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RoutesStackList } from '../Components/Navigation/types'
import CategoryScreenItem from '../Components/CategoryScreenItem/CategoryScreenItem'
import usePageCategories from '../Hooks/useCategories/usePageCategories'
import { useThemeContext } from '../Context/ThemeContext/ThemeContext'
import { THEME, getColors } from '../theme'
import { useUserContext } from '../Context/UserContext/UserContext'

const Categories = () => {
  const navigation = useNavigation<StackNavigationProp<RoutesStackList>>()
  const { categories } = useCategoriesContext()
  const { loading } = usePageCategories()
  const { theme } = useThemeContext()
  const { textColor, backGroundColor } = getColors(theme)
  const { userData } = useUserContext()
  const role = userData?.user.role
  const isAdmin = role && role === 'admin'

  const handleAddCategory = () => {
    navigation.navigate('FormCategoryScreen')
  }
  const borderBottomTitle = theme === 'dark' && styles.headerFlatBorderLight
  const borderContainerEmpty = theme === 'dark' && styles.borderCardDark
  const someNoDefault = categories.some((c) => c.isDefault === false)
  return (
    <Layout>
      {loading ? (
        <ActivityIndicator style={styles.activityIndicator} size={'large'} color={'#1473E6'} />
      ) : (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
            <TextComponent bold styles={styles.textButton}>
              Agregar categorías
            </TextComponent>
          </TouchableOpacity>
          {isAdmin && categories.length > 0 ? (
            <FlatList
              ListHeaderComponent={
                <TextComponent
                  styles={{ ...textColor, ...styles.headerFlatListText, ...borderBottomTitle }}
                  bold>
                  Tus categorías
                </TextComponent>
              }
              style={styles.flatList}
              contentContainerStyle={[styles.contentFlatList, backGroundColor]}
              showsVerticalScrollIndicator={false}
              data={categories}
              renderItem={({ item }) => (
                <CategoryScreenItem
                  iconName={item.iconName}
                  isDefault={item.isDefault}
                  name={item.name}
                  user={item.user}
                  _id={item._id}
                />
              )}
            />
          ) : someNoDefault ? (
            <FlatList
              ListHeaderComponent={
                <TextComponent
                  styles={{ ...textColor, ...styles.headerFlatListText, ...borderBottomTitle }}
                  bold>
                  Tus categorías
                </TextComponent>
              }
              style={styles.flatList}
              contentContainerStyle={[styles.contentFlatList, backGroundColor]}
              showsVerticalScrollIndicator={false}
              data={categories}
              renderItem={({ item }) => (
                <CategoryScreenItem
                  iconName={item.iconName}
                  isDefault={item.isDefault}
                  name={item.name}
                  user={item.user}
                  _id={item._id}
                />
              )}
            />
          ) : (
            <View style={[styles.container, { justifyContent: 'flex-start' }]}>
              <View style={[styles.containerEmpty, backGroundColor, borderContainerEmpty]}>
                <TextComponent
                  styles={{ ...textColor, ...styles.headerFlatListText, ...borderBottomTitle }}
                  bold>
                  Tus categorías
                </TextComponent>
                <TextComponent styles={{ ...textColor, ...styles.textEmpty }} bold>
                  No tienes categorías
                </TextComponent>
              </View>
            </View>
          )}
        </View>
      )}
    </Layout>
  )
}

export default Categories

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    marginTop: 30,
    borderRadius: 5
  },
  button: {
    backgroundColor: THEME.colors.bgButtons,
    width: '100%',
    paddingVertical: 10,
    borderRadius: 5
  },
  textButton: {
    color: THEME.colors.themeDark.Text,
    textAlign: 'center'
  },
  flatList: {
    flex: 1,
    marginTop: 20
  },
  headerFlatListText: {
    textAlign: 'center',
    fontSize: 18,
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 10
  },
  headerFlatBorderLight: {
    borderBottomColor: THEME.colors.themeDark.Text
  },
  contentFlatList: {
    rowGap: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  activityIndicator: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerEmpty: {
    justifyContent: 'flex-start',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    rowGap: 10
  },
  borderCardDark: {
    borderColor: THEME.colors.themeDark.Text
  },
  textEmpty: {
    fontSize: 20,
    alignSelf: 'center'
  }
})
