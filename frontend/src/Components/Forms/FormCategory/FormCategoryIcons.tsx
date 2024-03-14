import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import CategoryIconItem from '../../CategoryIconItem/CategoryIconItem'
import { CategoryIcon } from '../../CategoryIconItem/types'
import FlatListItemSeparator from '../../FlatListSeparator/FlatListSeparator'

interface FormCategoryIconsProps {
  onIconPicked: (category: CategoryIcon) => void
}
/* <MaterialIcons name="checkroom" size={24} color="black" /> */
const FormCategoryIcons = ({ onIconPicked }: FormCategoryIconsProps) => {
  const iconNames = [
    { name: '', iconName: 'store' },
    { name: '', iconName: 'shopping-cart' },
    { name: '', iconName: 'restaurant-menu' },
    { name: '', iconName: 'directions-car' },
    { name: '', iconName: 'local-gas-station' },
    { name: '', iconName: 'home' },
    { name: '', iconName: 'power' },
    { name: '', iconName: 'phone' },
    { name: '', iconName: 'medical-services' },
    { name: '', iconName: 'fitness-center' },
    { name: '', iconName: 'school' },
    { name: '', iconName: 'work' },
    { name: '', iconName: 'pets' },
    { name: '', iconName: 'child-friendly' },
    { name: '', iconName: 'directions-transit' },
    { name: '', iconName: 'beach-access' },
    { name: '', iconName: 'movie' },
    { name: '', iconName: 'book' },
    { name: '', iconName: 'music-note' },
    { name: '', iconName: 'brush' },
    { name: '', iconName: 'build' },
    { name: '', iconName: 'computer' },
    { name: '', iconName: 'theater-comedy' },
    { name: '', iconName: 'card-giftcard' },
    { name: '', iconName: 'savings' },
    { name: '', iconName: 'payment' },
    { name: '', iconName: 'receipt' },
    { name: '', iconName: 'account-balance' },
    { name: '', iconName: 'local-atm' },
    { name: '', iconName: 'call' },
    { name: '', iconName: 'trending-up' },
    { name: '', iconName: 'water-drop' },
    { name: '', iconName: 'volunteer-activism' },
    { name: '', iconName: 'wifi' },
    { name: '', iconName: 'local-mall' },
    { name: '', iconName: 'checkroom' },
    { name: '', iconName: 'gas-meter' },
    { name: '', iconName: 'event' },
    { name: '', iconName: 'family-restroom' },
    { name: '', iconName: 'local-drink' }
  ].sort((a, b) => a.iconName.localeCompare(b.iconName))

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      numColumns={5}
      style={style.flatList}
      contentContainerStyle={style.contentContainer}
      columnWrapperStyle={style.columnWrapper}
      ItemSeparatorComponent={FlatListItemSeparator}
      data={iconNames}
      renderItem={({ item }) => (
        <CategoryIconItem key={item.name} onIconPicked={onIconPicked} category={item} />
      )}
    />
  )
}

export default FormCategoryIcons

const style = StyleSheet.create({
  flatList: {
    flex: 1,
    marginTop: 10
  },
  contentContainer: {
    rowGap: 20
  },
  columnWrapper: {
    justifyContent: 'space-between'
  }
})
