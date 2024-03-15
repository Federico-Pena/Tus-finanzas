import express, { Application } from 'express'
import request from 'supertest'
import { dbTestConnect, dbTestDisconnect } from '../../databaseTest'
import { ROUTES } from '../../constants'
import User from '../../models/user'
import { getTransactions } from './getTransactions'
import { generateValidToken, mockCategories, mockTransactions, mockUsers } from '../testConst'
import { Transaction } from '../../models/transaction'
import authMiddleware from '../../middleware/authorization'
import { Category } from '../../models/category'
let app: Application
let token: string
const url = ROUTES.TRANSACTIONS.getTransactions.replace(':user', '')
beforeAll(async () => {
  app = express()
  app.use(express.json())
  app.get(ROUTES.TRANSACTIONS.getTransactions, authMiddleware, getTransactions)
  await dbTestConnect()

  const newUser = new User(mockUsers[0])
  const newUser2 = new User(mockUsers[1])
  const mockCategoriesSaved = await Category.insertMany(mockCategories)
  const usersSaved = await User.insertMany([newUser, newUser2])
  mockTransactions[0].user = usersSaved[0]._id.toString()
  mockTransactions[0].category = mockCategoriesSaved[0]._id.toString()
  mockTransactions[1].user = usersSaved[0]._id.toString()
  mockTransactions[1].category = mockCategoriesSaved[1]._id.toString()
  await Transaction.insertMany(mockTransactions)
  token = generateValidToken(usersSaved[0].username, 'user')
  app.set('Authorization', `Bearer ${token}`)
})
afterAll(async () => {
  await dbTestDisconnect()
})

describe('getTransactions  controller', () => {
  it('It should return transactions of the user', async () => {
    await request(app)
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        const { transactions } = response.body.data
        expect(transactions[0].user._id).toBe(mockTransactions[0].user)
        expect(transactions[0].category._id).toBe(mockTransactions[0].category)
        expect(transactions[1].user._id).toBe(mockTransactions[0].user)
        expect(transactions[1].category._id).toBe(mockTransactions[1].category)
      })
  })
  it('It should return error 404 if user not have transactions', async () => {
    const usersSaved = await User.find()
    const falseToken = generateValidToken(usersSaved[1].username, 'user')
    await request(app)
      .get(url)
      .set('Authorization', `Bearer ${falseToken}`)
      .expect(404)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('No se encontraron transacciones.')
      })
  })
  it('should return error 500 when a server error occurred message should be "Error interno del servidor"', async () => {
    vi.spyOn(Transaction, 'find').mockImplementationOnce(() => {
      throw new Error('Simulated internal server error')
    })
    await request(app)
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .expect(500)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Error interno del servidor.')
      })
  })
})
