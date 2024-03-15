import express, { Application } from 'express'
import { ROUTES } from '../../constants'
import request from 'supertest'
import { dbTestConnect, dbTestDisconnect } from '../../databaseTest'
import User from '../../models/user'
import { generateValidToken, mockTransactions, mockUsers } from '../testConst'
import { deleteTransactions } from './deleteTransactions'
import { Transaction } from '../../models/transaction'
import authMiddleware from '../../middleware/authorization'

let app: Application
let token: string
const url = `${ROUTES.TRANSACTIONS.deleteTransactions.replace(':id', '')}`
beforeAll(async () => {
  app = express()
  app.use(express.json())
  app.delete(ROUTES.TRANSACTIONS.deleteTransactions, authMiddleware, deleteTransactions)
  await dbTestConnect()
  const newUser = new User(mockUsers[0])
  const newUser2 = new User(mockUsers[1])
  const usersSaved = await User.insertMany([newUser, newUser2])
  mockTransactions[0].user = usersSaved[0]._id.toString()
  await Transaction.insertMany(mockTransactions)
  token = generateValidToken(usersSaved[0].username, 'user')
  app.set('Authorization', `Bearer ${token}`)
})
afterAll(async () => {
  await dbTestDisconnect()
})
describe('deleteTransactions controller', () => {
  it('should return error 500 when findByIdAndDelete fail message should be "Error al borrar la transacción.', async () => {
    const transactions = await Transaction.find()
    const transactionIdToDelete = transactions[0]._id.toString()
    const urlWithId = url + transactionIdToDelete
    vi.spyOn(Transaction, 'findByIdAndDelete').mockResolvedValueOnce(null)
    await request(app)
      .delete(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .expect(500)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('Error al borrar la transacción.')
      })
  })
  it('should return error 404 when user not found message should be "El usuario no existe."', async () => {
    const transactions = await Transaction.find()
    const transactionIdToDelete = transactions[0]._id.toString()
    const urlWithId = url + transactionIdToDelete
    const userName = 'Juan pedro'
    const falseToken = generateValidToken(userName, 'user')
    await request(app)
      .delete(urlWithId)
      .set('Authorization', `Bearer ${falseToken}`)
      .expect(404)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('El usuario no existe.')
      })
  })
  it('should return error 404 when transaction not found or does not belong to the user message should be "Transacción no encontrada o no pertenece al usuario."', async () => {
    const transactions = await Transaction.find()
    const transactionIdToDelete = transactions[1]._id.toString()
    const urlWithId = url + transactionIdToDelete
    await request(app)
      .delete(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('Transacción no encontrada o no pertenece al usuario.')
      })
  })

  it('should return error 500 when a server error occurred message should be "Error interno del servidor"', async () => {
    const transactions = await Transaction.find()
    const transactionIdToDelete = transactions[0]._id.toString()
    const urlWithId = url + transactionIdToDelete

    vi.spyOn(Transaction, 'findByIdAndDelete').mockImplementationOnce(() => {
      throw new Error('Simulated internal server error')
    })
    await request(app)
      .delete(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .expect(500)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Error interno del servidor.')
      })
  })
  it('should delete a transaction', async () => {
    const transactions = await Transaction.find()
    const transactionIdToDelete = transactions[0]._id.toString()
    const urlWithId = url + transactionIdToDelete
    await request(app)
      .delete(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        const { data, message } = res.body
        expect(data.user).toBe(transactions[0].user.toString())
        expect(data.amount).toBe(transactions[0].amount)
        expect(data.description).toBe(transactions[0].description)
        expect(data.isPayment).toBe(transactions[0].isPayment)
        expect(data.notificationEnabled).toBe(transactions[0].notificationEnabled)
        expect(data.category).toBe(transactions[0].category.toString())
        expect(message).toBe('Transacción eliminada con éxito.')
      })
  })
})
