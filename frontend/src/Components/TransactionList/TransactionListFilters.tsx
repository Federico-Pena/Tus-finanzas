import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TextComponent from '../TextComponent/TextComponent'
import { useTransactionContext } from '../../Context/TransactionsContext/TransactionContext'
import dayjs from 'dayjs'
import DatePickerComponent from '../DateTimePicker/DatePickerComponent'
import { THEME, getColors } from '../../theme'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'

interface IFilterCategory {
  name: string
  iconName: string
}

const TransactionListFilters = () => {
  const { dispatch, transactions, transactionsFiltered } = useTransactionContext()
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor, textColor } = getColors(theme)
  const [categories, setCategories] = useState<IFilterCategory[]>([])
  const [viewFilters, setViewFilters] = useState(false)
  const [filters, setFilters] = useState({
    isPayment: undefined,
    category: undefined,
    date: undefined
  })

  useEffect(() => {
    const uniqueCategories = transactions.reduce((acc: IFilterCategory[], curr) => {
      const found = acc.find((item: any) => item.name === curr.category.name)
      if (!found) {
        acc.push(curr.category)
      }
      return acc
    }, [])
    setCategories(uniqueCategories.sort((a, b) => a.name.localeCompare(b.name)))
  }, [transactions])

  const handleFilter = (filter: any) => {
    setFilters({ ...filters, ...filter })
    dispatch({ type: 'FILTER_TRANSACTIONS', payload: { ...filters, ...filter } })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, shadowColor]}
        onPress={() => setViewFilters(!viewFilters)}>
        <TextComponent bold styles={styles.textButton}>
          {viewFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </TextComponent>
        {viewFilters ? (
          <MaterialCommunityIcons name='eye-off' size={24} color='white' />
        ) : (
          <MaterialCommunityIcons name='eye-outline' size={24} color='white' />
        )}
      </TouchableOpacity>
      {viewFilters && (
        <View style={[styles.containerFilters, backGroundColor, shadowColor]}>
          <TouchableOpacity
            style={[styles.button, shadowColor]}
            onPress={() =>
              handleFilter({
                isPayment: undefined,
                category: undefined,
                date: undefined
              })
            }>
            <TextComponent bold styles={{ ...styles.textButton, ...shadowColor }}>
              Limpiar Filtros
            </TextComponent>
          </TouchableOpacity>
          <DatePickerComponent
            reset={filters.date === undefined}
            value={filters.date || dayjs().toDate()}
            onChangeDate={(date) => handleFilter({ date: date })}
          />
          <View style={styles.containerType}>
            <TouchableOpacity
              style={[
                styles.buttonType,
                styles.typeIsPayment,
                shadowColor,
                filters.isPayment === true && styles.selected
              ]}
              onPress={() => handleFilter({ isPayment: true })}>
              <TextComponent bold>Ingresos</TextComponent>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttonType,
                styles.typeNotIsPayment,
                shadowColor,
                filters.isPayment === false && styles.selected
              ]}
              onPress={() => handleFilter({ isPayment: false })}>
              <TextComponent bold>Gastos</TextComponent>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            style={styles.flatList}
            contentContainerStyle={styles.contentFlatList}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.contentItemFlatList,
                  filters.category === item.name && styles.selected
                ]}
                onPress={() => handleFilter({ category: item.name })}>
                <TextComponent styles={styles.textButton} bold>
                  {item.name}
                </TextComponent>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.name}
          />
          {Object.values(filters).some((filter) => filter !== undefined) &&
          transactionsFiltered.length === 0 ? (
            <View style={styles.containerTextError}>
              <TextComponent styles={styles.textError} bold>
                Ningún elemento encontrado
              </TextComponent>
            </View>
          ) : (
            transactionsFiltered.length > 0 && (
              <View style={styles.container}>
                <TextComponent styles={{ ...textColor, ...shadowColor }} bold>
                  {transactionsFiltered.length}{' '}
                  {transactionsFiltered.length > 1
                    ? 'elementos encontrados'
                    : 'elemento encontrado'}
                </TextComponent>
              </View>
            )
          )}
        </View>
      )}
    </View>
  )
}

export default TransactionListFilters
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    width: '100%'
  },
  button: {
    backgroundColor: THEME.colors.bgButtons,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: '100%'
  },
  textButton: {
    color: THEME.colors.themeDark.Text
  },
  containerFilters: {
    rowGap: 20,
    padding: 20,
    width: '100%',
    position: 'absolute',
    top: 45,
    borderRadius: 5
  },
  containerType: {
    flexDirection: 'row',
    columnGap: 10,
    overflow: 'hidden',
    paddingVertical: 10
  },
  buttonType: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    flexGrow: 1,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  typeIsPayment: {
    backgroundColor: THEME.colors.themeLight.green
  },
  typeNotIsPayment: {
    backgroundColor: THEME.colors.themeLight.red
  },
  flatList: {
    width: '100%',
    marginTop: 10
  },
  contentFlatList: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  contentItemFlatList: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: THEME.colors.bgButtons,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  containerTextError: {
    flexDirection: 'row',
    borderRadius: 5
  },
  textError: {
    color: THEME.colors.themeLight.red,
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'center'
  },
  selected: {
    borderColor: THEME.colors.themeLight.orange
  }
})
