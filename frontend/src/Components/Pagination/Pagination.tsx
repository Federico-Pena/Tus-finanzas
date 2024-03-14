import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { PaginationProps } from './types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TextComponent from '../TextComponent/TextComponent'
import { ScrollView } from 'react-native-gesture-handler'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'
import { THEME, getColors } from '../../theme'
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor, textColor } = getColors(theme)
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber)
    }
  }
  const renderPages = () => {
    const pageNumber = []
    for (let i = 1; i <= 20; i++) {
      pageNumber.push(
        <TouchableOpacity
          key={i}
          style={[style.buttonPage, i === currentPage && style.selected]}
          onPress={() => handlePageChange(i)}
          disabled={i === currentPage}>
          <TextComponent styles={textColor} children={i} />
        </TouchableOpacity>
      )
    }
    return pageNumber
  }
  const borderColor = theme === 'dark' ? style.containerBorderDark : style.containerBorderLight
  const iconColor = theme === 'dark' ? '#fff' : '#000'
  return (
    <View style={[style.container, borderColor, shadowColor, backGroundColor]}>
      <TouchableOpacity
        style={style.buttonArrow}
        onPress={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}>
        <MaterialCommunityIcons name='arrow-left-bold' size={24} color={iconColor} />
      </TouchableOpacity>
      <View style={style.containerPages}>
        <ScrollView
          contentContainerStyle={style.scrollPages}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {renderPages()}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={style.buttonArrow}
        onPress={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}>
        <MaterialCommunityIcons name='arrow-right-bold' size={24} color={iconColor} />
      </TouchableOpacity>
    </View>
  )
}

export default Pagination

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
    height: 60,
    borderRadius: 5
  },
  containerBorderDark: {
    borderColor: THEME.colors.themeDark.Text
  },
  containerBorderLight: {
    borderColor: THEME.colors.themeLight.Text
  },
  /* className='flex-1 h-full items-center justify-center bg-white dark:bg-darkBackgroundColor dark:shadow-shadowLight' */
  containerPages: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonPage: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.bgButtons,
    borderRadius: 30
  },
  selected: {
    opacity: 0.5
  },
  buttonArrow: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  scrollPages: {
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10
  }
})
