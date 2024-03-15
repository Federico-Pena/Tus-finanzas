import { Router } from 'express'
import { ROUTES } from '../constants'
import { sendNotification } from '../controllers/notifications/sendExpoNotification'

export const notificationRoutes = Router()

notificationRoutes.get(ROUTES.NOTIFICATIONS.getCronNotifications, sendNotification)
