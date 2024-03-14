import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import CategoryIconItem from '../../CategoryIconItem/CategoryIconItem'
import { CategoryIcon } from '../../CategoryIconItem/types'
import FlatListItemSeparator from '../../FlatListSeparator/FlatListSeparator'

interface FormCategoryIconsProps {
  onIconPicked: (category: CategoryIcon) => void
}

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
    { name: '', iconName: 'flight' },
    { name: '', iconName: 'beach-access' },
    { name: '', iconName: 'movie' },
    { name: '', iconName: 'book' },
    { name: '', iconName: 'music-note' },
    { name: '', iconName: 'brush' },
    { name: '', iconName: 'build' },
    { name: '', iconName: 'computer' },
    { name: '', iconName: 'shopping-basket' },
    { name: '', iconName: 'attach-money' },
    { name: '', iconName: 'savings' },
    { name: '', iconName: 'payment' },
    { name: '', iconName: 'receipt' },
    { name: '', iconName: 'account-balance' },
    { name: '', iconName: 'local-atm' },
    { name: '', iconName: 'monetization-on' },
    { name: '', iconName: 'trending-up' },
    { name: '', iconName: 'security' },
    { name: '', iconName: 'volunteer-activism' },
    { name: '', iconName: 'eco' },
    { name: '', iconName: 'star-rate' },
    { name: '', iconName: 'new-releases' },
    { name: '', iconName: 'autorenew' },
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
