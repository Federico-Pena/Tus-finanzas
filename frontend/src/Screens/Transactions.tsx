import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'
import Layout from '../Components/Layout/Layout'
import Pagination from '../Components/Pagination/Pagination'
import TransactionList from '../Components/TransactionList/TransactionList'
import { useTransactionContext } from '../Context/TransactionsContext/TransactionContext'
import { FontAwesome6 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RoutesStackList } from '../Components/Navigation/types'
import usePageTransactions from '../Hooks/useTransactions/usePageTransactions'
import TextComponent from '../Components/TextComponent/TextComponent'
import { THEME } from '../theme'
import TransactionListFilters from '../Components/TransactionList/TransactionListFilters'

const Transactions = () => {
  const { page, totalPages, changePage, loading } = usePageTransactions()
  const { transactions } = useTransactionContext()
  const { navigate } = useNavigation<StackNavigationProp<RoutesStackList>>()

  const openForm = () => {
    navigate('FormTransactionScreen')
  }

  return (
    <Layout>
      {loading ? (
        <ActivityIndicator size={'large'} color={'#1473E6'} />
      ) : (
        <View style={styles.container}>
          <View style={styles.containerHeader}>
            <TouchableOpacity style={styles.button} onPress={openForm}>
              <TextComponent bold styles={styles.textButton}>
                Nueva
              </TextComponent>
              <FontAwesome6 name='add' size={24} color='white' />
            </TouchableOpacity>
            <TransactionListFilters />
          </View>

          <View style={styles.containerList}>
            <TransactionList />
            {transactions.length > 19 ? (
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} />
            ) : null}
          </View>
        </View>
      )}
    </Layout>
  )
}

export default Transactions

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1
  },
  containerHeader: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 10
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
  containerList: {
    flex: 1,
    width: '100%',
    paddingVertical: 10
  }
})
