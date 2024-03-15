import express, { Application } from 'express'
import request from 'supertest'
import { dbTestConnect, dbTestDisconnect } from '../../databaseTest'
import { ROUTES } from '../../constants'
import User from '../../models/user'
import { generateValidToken, mockCategories, mockTransactions, mockUsers } from '../testConst'
import { Category } from '../../models/category'
import { postTransactions } from './postTransactions'
import authMiddleware from '../../middleware/authorization'
import { Transaction } from '../../models/transaction'
let app: Application
let token: string
const url = ROUTES.TRANSACTIONS.postTransactions
beforeAll(async () => {
  app = express()
  app.use(express.json())
  app.post(ROUTES.TRANSACTIONS.postTransactions, authMiddleware, postTransactions)
  await dbTestConnect()

  const newUser = new User(mockUsers[0])
  const userSaved = await newUser.save()

  mockCategories[1].user = userSaved._id
  await Category.insertMany(mockCategories)
  token = generateValidToken(userSaved.username, 'user')
  app.set('Authorization', `Bearer ${token}`)
})
afterAll(async () => {
  await dbTestDisconnect()
})

describe('postTransactions  controller', () => {
  it('Should create new transaction', async () => {
    const users = await User.find()
    const categories = await Category.find()
    const userId = users[0]._id.toString()
    const categoryName = categories[0].name
    mockTransactions[0].user = userId
    mockTransactions[0].category = categoryName

    await request(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(mockTransactions[0])
      .expect(200)
      .then((response) => {
        const { data } = response.body
        expect(data.user._id).toBe(userId)
        expect(data.category.name).toBe(mockTransactions[0].category)
        expect(data.amount).toBe(mockTransactions[0].amount)
        expect(data.description).toBe(mockTransactions[0].description)
        expect(data.isPayment).toBe(mockTransactions[0].isPayment)
        expect(data.paymentDueDate).toBe(mockTransactions[0].paymentDueDate)
        expect(data.notificationEnabled).toBe(mockTransactions[0].notificationEnabled)
      })
  })
  it('should return error 404 when user not exist message should be "El usuario no existe."', async () => {
    const categories = await Category.find()
    const categoryName = categories[0].name
    const userName = 'Juan Pedro'
    mockTransactions[0].category = categoryName
    const tokenUser = generateValidToken(userName, 'user')

    await request(app)
      .post(url)
      .set('Authorization', `Bearer ${tokenUser}`)
      .send(mockTransactions[0])
      .expect(404)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('El usuario no existe.')
      })
  })
  it('should return error 404 when category not exist message should be "La categoría no existe."', async () => {
    const users = await User.find()
    const userId = users[0]._id.toString()
    const categoryName = 'False category'
    mockTransactions[0].user = userId
    mockTransactions[0].category = categoryName
    await request(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(mockTransactions[0])
      .expect(404)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('La categoría no existe.')
      })
  })
  it('should return error 500 when a server error occurred message should be "Error interno del servidor"', async () => {
    const users = await User.find()
    const categories = await Category.find()
    const userId = users[0]._id.toString()
    const categoryName = categories[0].name
    mockTransactions[0].user = userId
    mockTransactions[0].category = categoryName
    vi.spyOn(Transaction.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Simulated internal server error')
    })
    await request(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(mockTransactions[0])
      .expect(500)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Error interno del servidor.')
      })
  })
})
