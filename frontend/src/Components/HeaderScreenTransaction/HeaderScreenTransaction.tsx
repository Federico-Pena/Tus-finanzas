import { View } from 'react-native'
import React from 'react'
import TextComponent from '../TextComponent/TextComponent'
import { useTransactionContext } from '../../Context/TransactionsContext/TransactionContext'

const HeaderScreenTransaction = () => {
  const { totalCount, transactions } = useTransactionContext()

  return (
    <View className='flex-row justify-between h-full flex-1 mb-4'>
      <View className='bg-backgroundColor rounded-md flex-1 justify-center items-center mr-2 shadow-lg shadow-black dark:shadow-white'>
        <TextComponent bold>Total: {totalCount}</TextComponent>
      </View>
      <View className='bg-green rounded-md flex-1 justify-center items-center mr-2 shadow-lg shadow-black dark:shadow-white'>
        <TextComponent bold>
          Ingresos: {transactions.filter((transaction) => transaction.isPayment).length}
        </TextComponent>
      </View>
      <View className='bg-red rounded-md flex-1 justify-center items-center mr-2 shadow-lg shadow-black dark:shadow-white'>
        <TextComponent bold>
          Gastos: {transactions.filter((transaction) => !transaction.isPayment).length}
        </TextComponent>
      </View>
    </View>
  )
}

export default HeaderScreenTransaction
