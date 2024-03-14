import { useCallback, useState } from 'react'
import registerForPushNotificationsAsync from './registerForPushNotificationsAsync'
import useFetch from '../useFetch/useFetch'
import { RUTES } from '../../config/Rutes'
import { ITransaction } from '../../Context/TransactionsContext/types'
import { scheduleNotificationAsync, setNotificationHandler } from 'expo-notifications'
import { Alert } from 'react-native'

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
})

const useNotification = () => {
  const { fetchData } = useFetch()
  const [isLoading, setLoading] = useState(false)
  const requestPermissionAndGetToken = async () => {
    setLoading(true)
    try {
      const token = await registerForPushNotificationsAsync()
      if (token) {
        const { status } = await fetchData({
          method: 'POST',
          url: RUTES.USER.postPushNotificationToken,
          body: { token: token }
        })
        if (status === 200) {
          return true
        }
      }
      return false
    } catch (error) {
      return false
    } finally {
      setLoading(false)
    }
  }

  const createNotification = async (transaction: ITransaction) => {
    if (transaction.notificationEnabled && transaction.paymentDueDate !== undefined) {
      const dateNotification = new Date(transaction.paymentDueDate)
      const message = `${String(transaction.description)}. Monto ${Number(
        transaction.amount
      )}. Fecha ${dateNotification.toLocaleDateString()} ${dateNotification.toLocaleTimeString()}`
      try {
        await scheduleNotificationAsync({
          content: {
            title: 'Recordatorio de transacción',
            body: message,
            sound: true
          },
          trigger: dateNotification
        })
      } catch (error) {
        Alert.alert('Ocurrió un error al crear la notificación')
      }
    }
  }
  return { requestPermissionAndGetToken, createNotification, isLoading }
}

export default useNotification
