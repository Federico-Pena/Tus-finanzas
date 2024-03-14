import express, { Application } from 'express'
import request from 'supertest'
import { dbTestConnect, dbTestDisconnect } from '../../databaseTest'
import { RUTES } from '../../constants'
import User from '../../models/user'
import { deleteAccount } from './deleteAccount'
import { hash } from 'bcrypt'
let app: Application

beforeAll(async () => {
  app = express()
  app.use(express.json())
  app.delete(RUTES.USER.deleteUserAccount, deleteAccount)
  await dbTestConnect()
  const userPassword = 'Password88'
  const saltRounds = 10
  const hashedPassword = await hash(userPassword, saltRounds)
  const newUser = new User({
    username: 'PepeExample',
    email: 'pepeExample@example.com',
    password: hashedPassword
  })
  await newUser.save()
})
afterAll(async () => {
  await dbTestDisconnect()
})

describe('login  controller', () => {
  it('It should give an error if the user not exists message should be "El usuario no existe."', async () => {
    const userName = 'PepeExample88'
    await request(app)
      .delete(RUTES.USER.deleteUserAccount.replace(':username', userName))
      .expect(404)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('El usuario no existe.')
      })
  })
  it('should return error 500 when findByIdAndDelete return null message should be "Error al eliminar el usuario."', async () => {
    const userName = 'PepeExample'
    vi.spyOn(User, 'findByIdAndDelete').mockResolvedValueOnce(null)
    await request(app)
      .delete(RUTES.USER.deleteUserAccount.replace(':username', userName))
      .expect(500)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('Error al eliminar el usuario.')
      })
  })

  it('should return error 500 when a server error occurred message should be "Error interno del servidor"', async () => {
    const userName = 'PepeExample'
    vi.spyOn(User, 'findByIdAndDelete').mockImplementationOnce(() => {
      throw new Error('Simulated internal server error')
    })
    await request(app)
      .delete(RUTES.USER.deleteUserAccount.replace(':username', userName))
      .expect(500)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('Error interno del servidor.')
      })
  })

  it('The user should be able to delete the account message should be "Usuario eliminado con éxito."', async () => {
    const userName = 'PepeExample'
    await request(app)
      .delete(RUTES.USER.deleteUserAccount.replace(':username', userName))
      .expect(200)
      .then((response) => {
        const { message } = response.body
        expect(message).toBe('Usuario eliminado con éxito.')
      })
  })
})
