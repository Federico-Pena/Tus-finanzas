import mongoose, { Schema } from 'mongoose'
import { ITransaction } from '../types'

const transactionSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: new Date() },
  isPayment: { type: Boolean, default: false },
  paymentDueDate: { type: Date },
  notificationEnabled: { type: Boolean, default: false }
})

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema)
