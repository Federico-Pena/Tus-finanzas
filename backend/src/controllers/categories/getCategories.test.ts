import express, { Application } from 'express'
import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { getCategories } from './getCategories'
import { Category } from '../../models/category'
import { RUTES } from '../../constants'
import { dbTestConnect, dbTestDisconnect } from '../../databaseTest'
import { generateValidToken, mockCategories } from '../testConst'
import authMiddleware from '../../middleware/authorization'
import User from '../../models/user'

let app: Application
let token: string
const url = RUTES.CATEGORIES.getCategories

beforeAll(async () => {
  app = express()
  app.use(express.json())
  app.get(RUTES.CATEGORIES.getCategories, authMiddleware, getCategories)
  await dbTestConnect()
  const user = new User({
    username: 'Usuario de Prueba',
    email: 'EmailDePrueba@gmail.com',
    password: 'passwordDePrueba'
  })
  const newUser = await user.save()
  token = generateValidToken(newUser.username, 'admin')
  app.set('Authorization', `Bearer ${token}`)
})
afterAll(async () => {
  await dbTestDisconnect()
})

describe('getCategories controller', () => {
  it('should return error 404 when not found categories and error message should be "No se encontraron categorías"', async () => {
    await request(app)
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('No se encontraron categorías.')
      })
  })
  it('should return all categories in te database', async () => {
    await Category.insertMany(mockCategories)
    await request(app)
      .get(url)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        const { data } = res.body
        expect(data[0]).toMatchObject(mockCategories[0])
        expect(data[1]).toMatchObject(mockCategories[1])
      })
  })
  it('should return error 500 when a server error occurred message should be "Error interno del servidor"', async () => {
    vi.spyOn(Category, 'find').mockImplementationOnce(() => {
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
