import express, { Application } from 'express'
import request from 'supertest'
import { dbTestConnect, dbTestDisconnect } from '../../databaseTest'
import { RUTES } from '../../constants'
import { register } from './register'
import User from '../../models/user'
import { userTest } from '../testConst'
let app: Application

beforeAll(async () => {
  app = express()
  app.use(express.json())
  app.post(RUTES.USER.registerUser, register)
  await dbTestConnect()
})
afterAll(async () => {
  await dbTestDisconnect()
})

describe('register  controller', () => {
  it('It should give an error if the username is less than 3 or more than 12 characters message should be "El nombre de usuario debe tener entre 3 y 12 caracteres."', async () => {
    await request(app)
      .post(RUTES.USER.registerUser)
      .send(userTest)
      .expect(400)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('El nombre de usuario debe tener entre 3 y 12 caracteres.')
      })
  })
  it('It should give an error if the email is not valid email message should be "El formato del correo electrónico es inválido."', async () => {
    const user = {
      username: 'pepeExample',
      email: 'pepeExample.com',
      password: 'password'
    }
    await request(app)
      .post(RUTES.USER.registerUser)
      .send(user)
      .expect(400)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('El formato del correo electrónico es inválido.')
      })
  })
  it('It should give an error if the password is not valid password message should be "La contraseña debe tener entre 8 y 12 caracteres y contener al menos una letra mayúscula, una letra minúscula y un número."', async () => {
    const user = {
      username: 'pepeExample',
      email: 'pepe@example.com',
      password: 'password'
    }
    await request(app)
      .post(RUTES.USER.registerUser)
      .send(user)
      .expect(400)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe(
          'La contraseña debe tener entre 8 y 12 caracteres y contener al menos una letra mayúscula, una letra minúscula y un número.'
        )
      })
  })
  it('It should create a new user message should be "Usuario registrado exitosamente, ahora inicie sesión."', async () => {
    const user = {
      username: 'PepeExample',
      email: 'pepe@example.com',
      password: 'Password8'
    }
    await request(app)
      .post(RUTES.USER.registerUser)
      .send(user)
      .expect(200)
      .then((response) => {
        const { message } = response.body
        expect(message).toBe('Usuario registrado exitosamente, ahora inicie sesión.')
      })
  })
  it('It should give an error if username or email already is associated in another account message should be "El nombre de usuario o email esta asociado a otra cuenta."', async () => {
    const user = {
      username: 'PepeExample',
      email: 'pepe@example.com',
      password: 'Password8'
    }
    await request(app)
      .post(RUTES.USER.registerUser)
      .send(user)
      .expect(400)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('El nombre de usuario o email esta asociado a otra cuenta.')
      })
  })
  it('should return error 500 when a server error occurred message should be "Error interno del servidor""', async () => {
    const user = {
      username: 'PepeExample',
      email: 'pepe@example.com',
      password: 'Password8'
    }
    vi.spyOn(User.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Simulated internal server error')
    })

    await request(app)
      .post(RUTES.USER.registerUser)
      .send(user)
      .expect(500)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('Error interno del servidor.')
      })
  })
})
