import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity, View, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import TextComponent from '../TextComponent/TextComponent'
import { ITransaction } from '../../Context/TransactionsContext/types'
import useTransactions from '../../Hooks/useTransactions/useTransactions'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RoutesStackList } from '../Navigation/types'
import { THEME, getColors, globalStyles } from '../../theme'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'

const TransactionItem = ({ transaction }: { transaction: ITransaction }) => {
  const [viewButtons, setViewButtons] = useState(false)
  const [modal, setModal] = useState(false)
  const { deleteTransaction } = useTransactions()
  const { navigate } = useNavigation<StackNavigationProp<RoutesStackList>>()
  const { theme } = useThemeContext()
  const { backGroundColor, shadowColor, textColor } = getColors(theme)
  const onConfirm = async (boolean: boolean) => {
    if (boolean) {
      await deleteTransaction(transaction._id)
      setModal(false)
    } else {
      setModal(false)
    }
  }
  const handleEdit = () => {
    navigate('FormTransactionScreen', {
      transaction: transaction
    })
    setViewButtons(false)
  }
  const handleDelete = () => {
    setModal(true)
    setViewButtons(false)
  }
  const backgroundColorPayment = transaction.isPayment
    ? THEME.colors.themeLight.green
    : THEME.colors.themeLight.red
  const borderColorTitle = theme === 'dark' ? styles.borderBottomDark : styles.borderBottomLight
  const borderColorCard = theme === 'dark' ? styles.borderCardDark : styles.borderCardLight

  return (
    <TouchableWithoutFeedback onPress={() => setViewButtons(!viewButtons)}>
      <View style={styles.container}>
        <ConfirmModal
          isVisible={modal}
          onCancel={() => setModal(false)}
          onConfirm={onConfirm}
          question='Desea borrar la transacción'
        />
        <View style={[backGroundColor, shadowColor, styles.card, borderColorCard]}>
          <View style={[styles.containerTitle, borderColorTitle]}>
            <TextComponent bold styles={{ ...styles.title, ...textColor }}>
              {transaction.description}
            </TextComponent>
            <MaterialIcons
              style={!transaction.isPayment && styles.rotate}
              name='thumb-up'
              size={24}
              color={backgroundColorPayment}
            />
          </View>
          <View style={styles.rowData}>
            <TextComponent bold styles={textColor}>
              Movimiento:
            </TextComponent>
            <TextComponent bold styles={textColor}>
              {transaction.amount}
            </TextComponent>
          </View>
          <View style={styles.rowData}>
            <TextComponent bold styles={textColor}>
              Tipo:
            </TextComponent>
            <TextComponent bold styles={textColor}>
              {transaction.isPayment ? 'Ingreso' : 'Gasto'}
            </TextComponent>
          </View>
          <View style={styles.rowData}>
            <TextComponent bold styles={textColor}>
              Categoría:
            </TextComponent>
            <TextComponent bold styles={textColor}>
              {' '}
              {transaction.category.name}
            </TextComponent>
          </View>
          <View style={styles.rowData}>
            <TextComponent bold styles={textColor}>
              Fecha de creación:
            </TextComponent>
            <TextComponent bold styles={textColor}>
              {new Date(transaction.date).toLocaleString()}
            </TextComponent>
          </View>
          <View style={styles.rowData}>
            <TextComponent bold styles={textColor}>
              Notificación:
            </TextComponent>
            <TextComponent bold styles={textColor}>
              {transaction.notificationEnabled ? 'Si' : 'No'}
            </TextComponent>
          </View>
          {transaction.paymentDueDate && (
            <View style={styles.rowData}>
              <TextComponent bold styles={textColor}>
                Fecha de notificación:
              </TextComponent>
              <TextComponent bold styles={textColor}>
                {new Date(transaction.paymentDueDate).toLocaleString()}
              </TextComponent>
            </View>
          )}
          {viewButtons && (
            <View style={styles.viewButtons}>
              <TouchableOpacity
                style={[styles.editButton, globalStyles.themeDarkShadow]}
                onPress={handleEdit}>
                <TextComponent bold styles={styles.textButton}>
                  Editar
                </TextComponent>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButton, globalStyles.themeDarkShadow]}
                onPress={handleDelete}>
                <TextComponent bold styles={styles.textButton}>
                  Eliminar
                </TextComponent>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default TransactionItem
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    width: '100%',
    borderRadius: 5,
    padding: 20,
    rowGap: 10,
    overflow: 'hidden',
    borderWidth: 1
  },
  borderCardLight: {
    borderColor: THEME.colors.themeLight.Text
  },
  borderCardDark: {
    borderColor: THEME.colors.themeDark.Text
  },
  containerTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,

    borderBottomWidth: 1
  },
  borderBottomLight: {
    borderBottomColor: THEME.colors.themeLight.Text
  },
  borderBottomDark: {
    borderBottomColor: THEME.colors.themeDark.Text
  },
  title: {
    fontSize: 20
  },
  rowData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  viewButtons: {
    position: 'absolute',
    backgroundColor: '#0202024e',
    width: '115%',
    height: '125%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 20
  },
  editButton: {
    backgroundColor: THEME.colors.bgButtons,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
  },
  deleteButton: {
    backgroundColor: THEME.colors.themeLight.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
  },
  textButton: {
    color: THEME.colors.themeDark.Text
  },

  rotate: {
    transform: [{ rotateX: '180deg' }]
  }
})
