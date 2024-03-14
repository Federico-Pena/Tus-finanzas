import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { PaginationProps } from './types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TextComponent from '../TextComponent/TextComponent'
import { ScrollView } from 'react-native-gesture-handler'
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber)
    }
  }
  const renderPages = () => {
    const pageNumber = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumber.push(
        <TouchableOpacity
          key={i}
          className={` bg-bgButtons border-darkBackgroundColor  justify-center items-center rounded-full h-6 w-6 ${
            i === currentPage ? '' : 'opacity-50'
          } `}
          onPress={() => handlePageChange(i)}
          disabled={i === currentPage}>
          <TextComponent tailwindClasses='text-white' children={i} />
        </TouchableOpacity>
      )
    }
    return pageNumber
  }
  return (
    <View className='flex-row w-full h-16 justify-between items-center rounded border overflow-hidden border-darkBackgroundColor shadow shadow-shadow dark:border-darkTextPrimary dark:shadow-shadowLight'>
      <TouchableOpacity
        className='bg-backgroundColor border-r border-darkBackgroundColor flex justify-center h-full px-4'
        onPress={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}>
        <MaterialCommunityIcons name='arrow-left-bold' size={24} color='black' />
      </TouchableOpacity>
      <View className='flex-1 h-full items-center justify-center bg-white dark:bg-darkBackgroundColor dark:shadow-shadowLight'>
        <TextComponent bold tailwindClasses='dark:text-darkTextPrimary'>
          Página
        </TextComponent>
        <ScrollView
          contentContainerStyle={style.scrollPages}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {renderPages()}
        </ScrollView>
      </View>
      <TouchableOpacity
        className='bg-backgroundColor border-l border-darkBackgroundColor  flex justify-center h-full px-4'
        onPress={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}>
        <MaterialCommunityIcons name='arrow-right-bold' size={24} color='black' />
      </TouchableOpacity>
    </View>
  )
}

export default Pagination

const style = StyleSheet.create({
  scrollPages: {
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10
  }
})
