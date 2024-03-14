import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { Types } from 'mongoose'

export const categoryUpdate = {
  name: 'Categories 1 update',
  iconName: 'Categories 1 icon update',
  isDefault: false
}
export const categoryDataDefault = {
  name: 'Test Category Default',
  iconName: 'Test Icon Default',
  isDefault: true
}
export const userTest = {
  username: 'Usuario de Prueba',
  email: 'EmailDePrueba@gmail.com',
  password: 'passwordDePrueba'
}
export const mockCategories = [
  {
    name: 'Categories 1',
    iconName: 'Categories 1 icon',
    isDefault: true,
    user: new Types.ObjectId('65d6155ede4b6e40b9c7494b')
  },
  {
    name: 'Categories 2',
    iconName: 'Categories 2 icon',
    isDefault: false,
    user: new Types.ObjectId('65d6155ede4b6e40b9c7494b')
  }
]
export const mockUsers = [
  { username: 'PepeExample', email: 'pepeExample@example.com', password: 'Password88' },
  {
    username: 'MarioExample',
    email: 'marioExample@example.com',
    password: 'Password88'
  }
]
export const mockTransactions = [
  {
    user: '5f77cbbf8c1d663f14475064',
    category: '5f77cbdf91b7fe3f289e3e30',
    amount: 100,
    description: 'Venta de libros',
    date: new Date(),
    isPayment: false,
    notificationEnabled: false
  },
  {
    user: '5f77cbbf8c1d663f14475064',
    category: '5f77cbdf91b7fe3f289e3e30',
    amount: 50,
    description: 'Artículos de papelería',
    isPayment: true,
    date: new Date(),
    paymentDueDate: '2023-01-01 15:00',
    notificationEnabled: true
  },
  {
    user: '5f77cbbf8c1d663f14475064',
    category: '5f77cbdf91b7fe3f289e3e30',
    amount: 150,
    description: 'Venta de ropa',
    date: new Date(),
    isPayment: false,
    notificationEnabled: false
  }
]

export const generateValidToken = (username: string, role: string): string => {
  const secretKey = process.env.JWT_SECRET ?? ''
  const token = jwt.sign({ name: username, role }, secretKey, { expiresIn: '1h' })
  return token
}
