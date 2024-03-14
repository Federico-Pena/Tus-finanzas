import { StyleSheet, View } from 'react-native'
import React from 'react'
import TextComponent from '../../TextComponent/TextComponent'
import { FormData } from './types'
import { THEME, getColors } from '../../../theme'
import { useThemeContext } from '../../../Context/ThemeContext/ThemeContext'

interface props {
  watch: () => FormData
}

const FormTransactionSummary = ({ watch }: props) => {
  const { theme } = useThemeContext()
  const { textColor } = getColors(theme)
  return (
    <View style={styles.container}>
      <TextComponent styles={{ ...styles.title, ...textColor }} bold>
        Resumen
      </TextComponent>
      <View style={styles.rowData}>
        <TextComponent styles={textColor}>Tipo:</TextComponent>
        <TextComponent styles={textColor}>{watch().isPayment ? 'Ingreso' : 'Gasto'}</TextComponent>
      </View>
      {watch().amount !== 0 && (
        <View style={styles.rowData}>
          <TextComponent styles={textColor}>Cantidad:</TextComponent>
          <TextComponent styles={textColor}>$ {watch().amount}</TextComponent>
        </View>
      )}
      {watch().description && (
        <View style={styles.rowData}>
          <TextComponent styles={textColor}>Descripción:</TextComponent>
          <TextComponent styles={textColor}>{watch().description}</TextComponent>
        </View>
      )}
      {watch().category.name && (
        <View style={styles.rowData}>
          <TextComponent styles={textColor}>Categoría:</TextComponent>
          <TextComponent styles={textColor}>{watch().category.name}</TextComponent>
        </View>
      )}

      {watch().notificationEnabled && (
        <View style={styles.rowData}>
          <TextComponent styles={textColor}>Notificación:</TextComponent>
          <TextComponent styles={textColor}>
            {watch().paymentDueDate?.toLocaleString()}
          </TextComponent>
        </View>
      )}
    </View>
  )
}

export default FormTransactionSummary
const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderColor: THEME.colors.themeDark.Text,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    rowGap: 10,
    marginVertical: 10
  },
  title: {
    textAlign: 'center',
    fontSize: 18
  },
  rowData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
