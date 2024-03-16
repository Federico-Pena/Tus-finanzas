import {
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync,
  setNotificationChannelAsync,
  AndroidImportance
} from 'expo-notifications'
import { Alert, Platform } from 'react-native'
import Constants from 'expo-constants'
import { isDevice } from 'expo-device'

const { projectId } = Constants.expoConfig?.extra?.eas
const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
  let token
  if (Platform.OS === 'android') {
    setNotificationChannelAsync('default', {
      name: 'default',
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default'
    })
  }
  if (isDevice) {
    const { status: existingStatus } = await getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const userAgreed = await showPrePermissionDialog()
      if (!userAgreed) return
      const { status } = await requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Si no acepta no podrá programar notificaciones.')
      return
    }
    token = (await getExpoPushTokenAsync(projectId)).data
  }
  return token
}

export default registerForPushNotificationsAsync

const showPrePermissionDialog = (): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Habilitar Notificaciones de Transacciones',
      'Solo te enviaremos notificaciones si has seleccionado una fecha de notificación y has elegido recibir aviso de la misma.',
      [
        { text: 'No gracias', onPress: () => resolve(false), style: 'cancel' },
        { text: 'Sí, activar', onPress: () => resolve(true) }
      ]
    )
  })
}
