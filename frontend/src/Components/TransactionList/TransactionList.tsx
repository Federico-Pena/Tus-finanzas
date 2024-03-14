import { View, FlatList, StyleSheet } from 'react-native'
import TransactionItem from '../TransactionItem/TransactionItem'
import { useTransactionContext } from '../../Context/TransactionsContext/TransactionContext'
import TextComponent from '../TextComponent/TextComponent'
import { MaterialIcons } from '@expo/vector-icons'
import { useThemeContext } from '../../Context/ThemeContext/ThemeContext'
import { getColors } from '../../theme'

const TransactionList = () => {
  const { transactions, transactionsFiltered, totalCount } = useTransactionContext()
  const { theme } = useThemeContext()
  const { textColor, backGroundColor, shadowColor } = getColors(theme)

  const total = totalCount > transactions.length ? totalCount : transactions.length

  return transactions.length > 0 ? (
    <View style={styles.container}>
      {transactionsFiltered.length === 0 && totalCount > 0 && (
        <TextComponent
          styles={{ ...textColor, ...backGroundColor, ...shadowColor, ...styles.totalCount }}>
          Viendo {transactions.length} de {total} transacciones
        </TextComponent>
      )}

      {transactionsFiltered.length > 0 ? (
        <FlatList
          style={styles.flatList}
          data={transactionsFiltered}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.contentList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          style={styles.flatList}
          data={transactions}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.contentList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  ) : (
    <View style={[styles.containerTextEmpty, backGroundColor]}>
      <MaterialIcons name='money-off' size={50} color={theme === 'dark' ? 'white' : 'black'} />
      <TextComponent bold styles={{ ...styles.textEmpty, ...textColor }}>
        No tienes transacciones guardadas
      </TextComponent>
    </View>
  )
}

export default TransactionList
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1
  },
  flatList: {
    width: '100%'
  },
  contentList: {
    rowGap: 20
  },
  totalCount: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  containerTextEmpty: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  textEmpty: {
    fontSize: 20
  }
})
