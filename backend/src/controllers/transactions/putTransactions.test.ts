import express, { Application } from 'express'
import request from 'supertest'
import { dbTestConnect, dbTestDisconnect } from '../../databaseTest'
import { ROUTES } from '../../constants'
import User from '../../models/user'
import { generateValidToken, mockCategories, mockTransactions, mockUsers } from '../testConst'
import { Category } from '../../models/category'
import { Transaction } from '../../models/transaction'
import { putTransactions } from './putTransactions'
import authMiddleware from '../../middleware/authorization'
let app: Application
let token: string
const url = ROUTES.TRANSACTIONS.putTransactions.replace(':id', '')
beforeAll(async () => {
  app = express()
  app.use(express.json())
  app.put(ROUTES.TRANSACTIONS.putTransactions, authMiddleware, putTransactions)
  await dbTestConnect()

  const newUser = new User(mockUsers[0])
  const userSaved = await newUser.save()

  mockCategories[1].user = userSaved._id
  const newCategory = new Category(mockCategories[1])
  const category = await newCategory.save()

  mockTransactions[1].user = userSaved._id.toString()
  mockTransactions[1].category = category._id.toString()

  const newTransaction = new Transaction(mockTransactions[1])
  await newTransaction.save()

  token = generateValidToken(userSaved.username, 'user')
  app.set('Authorization', `Bearer ${token}`)
})
afterAll(async () => {
  await dbTestDisconnect()
})

describe('putTransactions  controller', () => {
  it('Should update transaction', async () => {
    const users = await User.find()
    const transactions = await Transaction.find()
    const userId = users[0]._id.toString()
    const transactionsId = transactions[0]._id.toString()
    mockTransactions[0].category = 'Categories 2'
    mockTransactions[0].paymentDueDate = '2023-01-20 10:00'
    const urlWhitId = url + transactionsId
    await request(app)
      .put(urlWhitId)
      .set('Authorization', `Bearer ${token}`)
      .send(mockTransactions[0])
      .expect(200)
      .then((response) => {
        const { data, message } = response.body
        expect(data.user._id).toBe(userId)
        expect(data.category.name).toBe(mockTransactions[0].category)
        expect(data.amount).toBe(mockTransactions[0].amount)
        expect(data.description).toBe(mockTransactions[0].description)
        expect(data.isPayment).toBe(mockTransactions[0].isPayment)
        expect(data.paymentDueDate).toBe(new Date('2023-01-20 10:00').toISOString())
        expect(data.notificationEnabled).toBe(mockTransactions[0].notificationEnabled)
        expect(message).toBe('Transacción actualizada con éxito.')
      })
  })
  it('should return error 404 when user not exist message should be "El usuario no existe."', async () => {
    const transactions = await Transaction.find()
    const userName = 'Juan pedro'
    const transactionsId = transactions[0]._id.toString()
    mockTransactions[0].category = 'Categories 2'
    const urlWhitId = url + transactionsId
    const tokenWhitId = generateValidToken(userName, 'user')

    await request(app)
      .put(urlWhitId)
      .set('Authorization', `Bearer ${tokenWhitId}`)
      .send(mockTransactions[0])
      .expect(404)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('El usuario no existe.')
      })
  })
  it('should return error 404 when transaction not exist message should be "La categoría no existe."', async () => {
    const transactions = await Transaction.find()
    const transactionsId = transactions[0]._id.toString()
    mockTransactions[0].category = 'False Category'
    const urlWhitId = url + transactionsId

    await request(app)
      .put(urlWhitId)
      .set('Authorization', `Bearer ${token}`)
      .send(mockTransactions[0])
      .expect(404)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('La categoría no existe.')
      })
  })

  it('should return error 404 when transaction not exist or does not belong to the user message should be "Transacción no encontrada o no pertenece al usuario."', async () => {
    const transactionsId = '5f77cbbf8c1d663f14475064'
    mockTransactions[0].category = 'Categories 2'
    const urlWhitId = url + transactionsId
    await request(app)
      .put(urlWhitId)
      .set('Authorization', `Bearer ${token}`)
      .send(mockTransactions[0])
      .expect(404)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Transacción no encontrada o no pertenece al usuario.')
      })
  })

  it('should return error 500 when a server error occurred message should be "Error interno del servidor"', async () => {
    const transactions = await Transaction.find()
    const transactionsId = transactions[0]._id.toString()
    mockTransactions[0].category = 'Categories 2'
    const urlWhitId = url + transactionsId

    vi.spyOn(Transaction.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Simulated internal server error')
    })

    await request(app)
      .put(urlWhitId)
      .set('Authorization', `Bearer ${token}`)
      .send(mockTransactions[0])
      .expect(500)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Error interno del servidor.')
      })
  })
})
