import React, { useState } from 'react'
import { View, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native'
import TextComponent from '../TextComponent/TextComponent'
import { THEME, getColors } from '../../theme'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'

interface Props {
  value: Date
  onChangeMonth: (month: number) => void
}

const MonthPickerComponent: React.FC<Props> = ({ onChangeMonth, value }) => {
  const [selectedMonth, setSelectedMonth] = useState(value.getMonth() + 1)
  const [modalVisible, setModalVisible] = useState(false)
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor } = getColors(theme)

  const months = [
    { label: 'Enero', value: 1 },
    { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 },
    { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 },
    { label: 'Diciembre', value: 12 }
  ]

  const onMonthPress = (month: number) => {
    onChangeMonth(month)
    setSelectedMonth(month)
    setModalVisible(false)
  }

  return (
    <View style={[internalStyles.monthButton, shadowColor]}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <TextComponent bold styles={internalStyles.textButtonStyle}>
          {months.find((m) => m.value === selectedMonth)?.label || 'Selecciona un mes'}
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
          data={months}
          numColumns={3}
          columnWrapperStyle={internalStyles.columnWrapperStyle}
          ListFooterComponentStyle={internalStyles.ListFooterComponentStyle}
          contentContainerStyle={[internalStyles.contentContainerStyle, backGroundColor]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={internalStyles.ListContentItemStyle}
              onPress={() => onMonthPress(item.value)}>
              <TextComponent bold>{item.label}</TextComponent>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <TextComponent bold styles={internalStyles.textButtonStyle}>
                Cerrar
              </TextComponent>
            </TouchableOpacity>
          }
          keyExtractor={(item) => item.label}
        />
      </Modal>
    </View>
  )
}

const internalStyles = StyleSheet.create({
  monthButton: {
    backgroundColor: THEME.colors.bgButtons,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  flatList: {
    flex: 1
  },
  columnWrapperStyle: {
    width: '90%',
    columnGap: 20
  },
  contentContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ListContentItemStyle: {
    padding: 10,
    backgroundColor: THEME.colors.themeLight.beige,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  ListFooterComponentStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: THEME.colors.bgButtons,
    borderRadius: 5,
    width: '90%',
    marginTop: 10
  },
  textButtonStyle: {
    color: THEME.colors.themeDark.Text,
    textAlign: 'center'
  }
})

export default MonthPickerComponent
