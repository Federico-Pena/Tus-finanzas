import { useEffect, useRef, useState } from 'react'
import registerForPushNotificationsAsync from './registerForPushNotificationsAsync'
import useFetch from '../useFetch/useFetch'
import { ROUTES } from '../../config/Routes'
import { Alert } from 'react-native'
import Constants from 'expo-constants'
import { isDevice } from 'expo-device'
import {
  Notification,
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync,
  setNotificationChannelAsync,
  AndroidImportance,
  setNotificationHandler,
  ExpoPushToken,
  Subscription,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription
} from 'expo-notifications'

const useNotification = () => {
  const { fetchData } = useFetch()
  const [isLoading, setLoading] = useState(false)
  const [pushToken, setPushToken] = useState<ExpoPushToken | undefined>()
  const [notification, setNotification] = useState<Notification | undefined>()

  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    })
  })
  const notificationListener = useRef<Subscription>()
  const responseListener = useRef<Subscription>()

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setPushToken(token)
    })
    notificationListener.current = addNotificationReceivedListener((notification) => {
      setNotification(notification)
    })
    responseListener.current = addNotificationResponseReceivedListener((response) => {
      console.log(response)
    })
    return () => {
      removeNotificationSubscription(notificationListener.current!)
      removeNotificationSubscription(responseListener.current!)
    }
  }, [])
  useEffect(() => {
    const requestPermissionAndGetToken = async () => {
      setLoading(true)
      try {
        if (pushToken?.data) {
          console.log(pushToken?.data)
          const { status } = await fetchData({
            method: 'POST',
            url: ROUTES.USER.postPushNotificationToken,
            body: { token: pushToken?.data }
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
    requestPermissionAndGetToken()
  }, [pushToken?.data])

  return { isLoading, pushToken }
}

export default useNotification
