// Models mongoose
export interface INotification {
  to: string
  title: string
  body: string
  sendAt: Date
}

export interface ICategory {
  name: string
  iconName: string
  user?: mongoose.Types.ObjectId
  isDefault: boolean
}
export interface IUser {
  username: string
  email: string
  password: string
  pushToken: string
}

export interface ITransaction {
  user: mongoose.Types.ObjectId
  category: mongoose.Types.ObjectId
  amount: number
  description: string
  date: Date
  isPayment: boolean
  paymentDueDate?: Date
  notificationEnabled: boolean
}

// Response express
export interface ResponseOptions {
  data?: any
  message?: string
  error?: string
}
