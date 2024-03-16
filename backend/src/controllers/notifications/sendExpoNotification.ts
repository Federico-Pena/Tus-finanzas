import { Expo, ExpoPushMessage } from 'expo-server-sdk'
import Notification from '../../models/notification'
import { Request, Response } from 'express'

const expo = new Expo()

const sendExpoNotification = async ({ to, title, body }: ExpoPushMessage): Promise<void> => {
  const message = {
    to,
    title,
    body
  }
  await expo.sendPushNotificationsAsync([message])
}

export const sendNotification = async (_req: Request, res: Response): Promise<void> => {
  const notifications = await Notification.find({
    sendAt: { $lte: new Date() }
  })
  try {
    for (const notification of notifications) {
      await sendExpoNotification({
        to: notification.to,
        title: notification.title,
        body: notification.body
      })
      await Notification.findByIdAndDelete({ _id: notification._id })
      console.log('Notificación enviada y eliminada')
    }
    res.status(200).send('Tareas programadas completadas')
  } catch (error) {
    console.error('Error al enviar notificación', error)
    res.status(500).send('Error al manejar las tareas programadas')
  }
}
