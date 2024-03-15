import { describe, it, expect } from 'vitest'
import express, { Application } from 'express'
import request from 'supertest'
import { ROUTES } from '../../constants'
import { postCategories } from './postCategories'
import { dbTestConnect, dbTestDisconnect } from '../../databaseTest'
import { Category } from '../../models/category'
import User from '../../models/user'
import { categoryDataDefault, categoryUpdate, generateValidToken, userTest } from '../testConst'
import authMiddleware from '../../middleware/authorization'

let app: Application
let token: string
const url = ROUTES.CATEGORIES.postCategories

beforeAll(async () => {
  app = express()
  app.use(express.json())
  app.post(ROUTES.CATEGORIES.postCategories, authMiddleware, postCategories)
  await dbTestConnect()
  const user = new User(userTest)
  const newUser = await user.save()
  token = generateValidToken(newUser.username, 'user')
  app.set('Authorization', `Bearer ${token}`)
})
afterAll(async () => {
  await dbTestDisconnect()
})

describe('postCategories controller', () => {
  it('should return error 404 when user not found', async () => {
    const userName = 'Juancito'
    const falseToken = generateValidToken(userName, 'user')
    await request(app)
      .post(url)
      .set('Authorization', `Bearer ${falseToken}`)
      .send(categoryUpdate)
      .expect(404)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('El usuario no existe.')
      })
  })

  it('should return error 400 when category creation fails, name and iconName required', async () => {
    await request(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Test Description',
        iconName: 'Test Icon'
      })
      .expect(400)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Nombre de categoría, icono y usuario son requeridos.')
      })
  })

  it('should return error 403 when category creation fails, only admin users can create default categories', async () => {
    await request(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(categoryDataDefault)
      .expect(403)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('No tienes permisos para crear una categoría predeterminada.')
      })
  })
  it('should create a category successfully', async () => {
    await request(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(categoryUpdate)
      .expect(200)
      .then((res) => {
        const { data, message } = res.body
        expect(data).toMatchObject(categoryUpdate)
        expect(message).toBe(`Categoría creada con éxito ${categoryUpdate.name}.`)
      })
  })

  it('should return error 400 when category or icon name already exists', async () => {
    await request(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(categoryUpdate)
      .expect(400)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('La categoría ya existe.')
      })
  })

  it('should return error 500 when a server error occurred message should be "Error interno del servidor"', async () => {
    vi.spyOn(Category.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Simulated internal server error')
    })

    await request(app)
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Category 2',
        description: 'Test Description 2',
        iconName: 'Test Icon 2'
      })
      .expect(500)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Error interno del servidor.')
      })
  })
})
