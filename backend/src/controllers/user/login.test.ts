import express, { Application } from 'express'
import request from 'supertest'
import { dbTestConnect, dbTestDisconnect } from '../../databaseTest'
import { ROUTES } from '../../constants'
import { login } from './login'
import User from '../../models/user'
import { hash } from 'bcrypt'
let app: Application

beforeAll(async () => {
  app = express()
  app.use(express.json())
  app.get(ROUTES.USER.loginUser, login)
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
  it('It should give an error if the user not exists message should be "Credenciales incorrectas."', async () => {
    const user = {
      usernameOrEmail: 'PepeExample88',
      password: 'password'
    }
    await request(app)
      .get(ROUTES.USER.loginUser)
      .send(user)
      .expect(400)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('Credenciales incorrectas.')
      })
  })
  it('It should give an error if password not match message should be "Credenciales incorrectas."', async () => {
    const user = {
      usernameOrEmail: 'PepeExample',
      password: 'password'
    }
    await request(app)
      .get(ROUTES.USER.loginUser)
      .send(user)
      .expect(400)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('Credenciales incorrectas.')
      })
  })
  it('The user should log in, message should be "Hola otra vez PepeExample"', async () => {
    const user = {
      usernameOrEmail: 'PepeExample',
      password: 'Password88'
    }
    await request(app)
      .get(ROUTES.USER.loginUser)
      .send(user)
      .expect(200)
      .then((response) => {
        const { data, message } = response.body
        expect(data.user.name).toEqual(user.usernameOrEmail)
        expect(message).toBe(`Hola otra vez ${user.usernameOrEmail}`)
      })
  })
  it('should return error 500 when a server error occurred message should be "Error interno del servidor""', async () => {
    const user = {
      usernameOrEmail: 'PepeExample',
      password: 'Password88'
    }
    vi.spyOn(User, 'findOne').mockImplementationOnce(() => {
      throw new Error('Simulated internal server error')
    })

    await request(app)
      .get(ROUTES.USER.loginUser)
      .send(user)
      .expect(500)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('Error interno del servidor.')
      })
  })
})
