import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { IconItemProps } from './types'
import TextComponent from '../TextComponent/TextComponent'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'
import { THEME, getColors } from '../../theme'
import { useUserContext } from '../../Context/UserContext/UserContext'

const CategoryIconItem = ({ category, onIconPicked }: IconItemProps) => {
  const { userData } = useUserContext()
  const role = userData?.user.role
  const isAdmin = role && role === 'admin'
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor, textColor } = getColors(theme)
  return (
    <TouchableOpacity
      style={[
        styles.iconItem,
        backGroundColor,
        shadowColor,
        theme === 'dark' && styles.iconBorderLight
      ]}
      onPress={() => {
        onIconPicked(category)
      }}>
      {category.name && <TextComponent styles={textColor}>{category.name}</TextComponent>}
      <MaterialIcons
        categoryName={category.name}
        name={category.iconName as keyof typeof MaterialIcons.glyphMap}
        size={24}
        color={theme === 'dark' ? '#fff' : 'black'}
      />
      {isAdmin && category.isDefault !== undefined && (
        <View style={styles.isAdmin}>
          <TextComponent styles={textColor}>Is default</TextComponent>
          {category.isDefault ? (
            <MaterialIcons
              name='check-circle-outline'
              size={24}
              color={theme === 'dark' ? '#fff' : 'black'}
            />
          ) : (
            <MaterialIcons
              name='radio-button-unchecked'
              size={24}
              color={theme === 'dark' ? '#fff' : 'black'}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}

export default CategoryIconItem

const styles = StyleSheet.create({
  iconItem: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    aspectRatio: '1/1'
  },
  iconBorderLight: {
    borderColor: THEME.colors.themeDark.Text
  },
  isAdmin: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 5
  }
})
