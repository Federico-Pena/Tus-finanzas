import { useState } from 'react'
import registerForPushNotificationsAsync from './registerForPushNotificationsAsync'
import useFetch from '../useFetch/useFetch'
import { ROUTES } from '../../config/Routes'
import { setNotificationHandler } from 'expo-notifications'

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
          url: ROUTES.USER.postPushNotificationToken,
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

  return { requestPermissionAndGetToken, isLoading }
}

export default useNotification
