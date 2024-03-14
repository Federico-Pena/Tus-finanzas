import React, { useState } from 'react'
import { View, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native'
import TextComponent from '../TextComponent/TextComponent'
import { THEME, getColors } from '../../theme'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'

interface Props {
  value: Date
  onChangeYear: (year: number) => void
}

const YearPickerComponent: React.FC<Props> = ({ onChangeYear, value }) => {
  const [selectedYear, setSelectedYear] = useState(value.getFullYear())
  const [modalVisible, setModalVisible] = useState(false)
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor } = getColors(theme)
  const generateYearOptions = () => {
    const maxYear = new Date().getFullYear()
    const years = []
    for (let i = maxYear; i >= 2000; i--) {
      years.push(i)
    }
    return years
  }

  const onYearPress = (year: number) => {
    setSelectedYear(year)
    onChangeYear(year)
    setModalVisible(false)
  }

  return (
    <View style={[internalStyles.yearButton, shadowColor]}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextComponent bold styles={internalStyles.textButtonStyle}>
          {selectedYear ? selectedYear : 'Selecciona un año'}
        </TextComponent>
      </TouchableOpacity>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}>
        <FlatList
          style={internalStyles.flatList}
          data={generateYearOptions()}
          numColumns={5}
          columnWrapperStyle={internalStyles.columnWrapperStyle}
          ListFooterComponentStyle={internalStyles.ListFooterComponentStyle}
          contentContainerStyle={[internalStyles.contentContainerStyle, backGroundColor]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={internalStyles.ListContentItemStyle}
              onPress={() => onYearPress(item)}>
              <TextComponent bold>{item}</TextComponent>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <TextComponent bold styles={internalStyles.textButtonStyle}>
                Cerrar
              </TextComponent>
            </TouchableOpacity>
          }
          keyExtractor={(item) => item.toString()}
        />
      </Modal>
    </View>
  )
}

const internalStyles = StyleSheet.create({
  yearButton: {
    backgroundColor: THEME.colors.bgButtons,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  flatList: {
    flex: 1
  },
  columnWrapperStyle: {
    columnGap: 15
  },
  contentContainerStyle: {
    flex: 1,
    rowGap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  ListContentItemStyle: {
    padding: 10,
    backgroundColor: THEME.colors.themeLight.beige,
    borderRadius: 5
  },
  ListFooterComponentStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: THEME.colors.bgButtons,
    borderRadius: 5,
    width: '90%'
  },
  textButtonStyle: {
    color: THEME.colors.themeDark.Text,
    textAlign: 'center'
  }
})

export default YearPickerComponent
