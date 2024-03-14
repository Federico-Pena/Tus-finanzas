import mongoose from 'mongoose'
import { INotification } from '../types'

const notificationSchema = new mongoose.Schema<INotification>({
  to: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  sendAt: { type: Date, required: true }
})

const Notification = mongoose.model<INotification>('Notification', notificationSchema)

export default Notification
