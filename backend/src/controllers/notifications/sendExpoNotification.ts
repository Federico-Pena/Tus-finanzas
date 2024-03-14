import { Expo, ExpoPushMessage } from 'expo-server-sdk'
import cron from 'node-cron'
import Notification from '../../models/notification'

const expo = new Expo()

const sendExpoNotification = async ({ to, title, body }: ExpoPushMessage): Promise<void> => {
  const message = {
    to,
    title,
    body
  }
  await expo.sendPushNotificationsAsync([message])
}

cron.schedule('* * * * *', async () => {
  console.log('Verificando notificaciones pendientes...')

  const notifications = await Notification.find({
    sendAt: { $lte: new Date() }
  })

  for (const notification of notifications) {
    try {
      await sendExpoNotification({
        to: notification.to,
        title: notification.title,
        body: notification.body
      })

      await Notification.findByIdAndDelete({ _id: notification._id })
      console.log('Notificación enviada y eliminada')
    } catch (error) {
      console.error('Error al enviar notificación', error)
    }
  }
})
