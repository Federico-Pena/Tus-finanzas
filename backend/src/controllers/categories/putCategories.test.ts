import express, { Application } from 'express'
import request from 'supertest'
import { Category } from '../../models/category'
import { putCategories } from './putCategories'
import { ROUTES } from '../../constants'
import { dbTestConnect, dbTestDisconnect } from '../../databaseTest'
import User from '../../models/user'
import {
  categoryDataDefault,
  categoryUpdate,
  generateValidToken,
  mockCategories,
  userTest
} from '../testConst'
import authMiddleware from '../../middleware/authorization'

let app: Application
let token: string
const url = `${ROUTES.CATEGORIES.putCategories.replace(':id', '')}`
beforeAll(async () => {
  app = express()
  app.use(express.json())
  app.put(ROUTES.CATEGORIES.putCategories, authMiddleware, putCategories)
  await dbTestConnect()
  const user = new User(userTest)
  const newUser = await user.save()
  mockCategories[1].user = newUser._id
  token = generateValidToken(newUser.username, 'user')
  app.set('Authorization', `Bearer ${token}`)
  await Category.insertMany(mockCategories)
})
afterAll(async () => {
  await dbTestDisconnect()
})

describe('putCategories', () => {
  it('should return error 400 when name or iconName are not in the request message should be "Nombre de categoría e icono son requeridos"', async () => {
    const category = await Category.find()
    const idString = category[1]._id.toString()
    const urlWithId = url + idString

    await request(app)
      .put(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Test Description',
        iconName: 'Test Icon update'
      })
      .expect(400)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Nombre de categoría e icono son requeridos.')
      })
  })
  it('should return error 404 when user not found message should be "El usuario no existe."', async () => {
    const category = await Category.find()
    const idString = category[0]._id.toString()
    const urlWithId = url + idString
    const userName = 'Juan pedro'
    const falseToken = generateValidToken(userName, 'user')
    await request(app)
      .put(urlWithId)
      .set('Authorization', `Bearer ${falseToken}`)
      .send(categoryUpdate)
      .expect(404)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('El usuario no existe.')
      })
  })
  it('should return error 404 when category is default or does not belong to the user message should be  "Categoría no encontrada, no pertenece al usuario o no puede editarla."', async () => {
    const category = await Category.find()
    const idString = category[0]._id.toString()
    const urlWithId = url + idString
    await request(app)
      .put(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send(categoryUpdate)
      .expect(404)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Categoría no encontrada, no pertenece al usuario.')
      })
  })
  it('should return error 403 when category default edit fails, only admin users can edit default categories', async () => {
    const category = await Category.find()
    const user = await User.find()
    const idUser: string = user[0]._id.toString()
    category[0].user = idUser
    const newCategory = await category[0].save()
    const idString = newCategory._id.toString()
    const urlWithId = url + idString
    await request(app)
      .put(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send(categoryDataDefault)
      .expect(403)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('No tienes permisos para editar esta categoría.')
      })
  })
  it('should update category by id', async () => {
    const category = await Category.find()
    const idString = category[1]._id.toString()
    const urlWithId = url + idString
    await request(app)
      .put(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send(categoryUpdate)
      .expect(200)
      .then((res) => {
        const { data, message } = res.body
        expect(data).toMatchObject(categoryUpdate)
        expect(message).toBe(`Categoría actualizada con éxito ${categoryUpdate.name}.`)
      })
  })
  it('should return error 400 when name of category already exists', async () => {
    const category = await Category.find()
    const idString = category[1]._id.toString()
    const urlWithId = url + idString
    const categoryUpdate = {
      name: category[0].name,
      iconName: 'Nuevo icono'
    }
    await request(app)
      .put(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send(categoryUpdate)
      .expect(400)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Esta categoría ya existe.')
      })
  })

  it('should return error 500 when save return null message should be "Error al editar la categoría"', async () => {
    const category = await Category.find()
    const idString = category[1]._id.toString()
    const urlWithId = url + idString

    vi.spyOn(Category.prototype, 'save').mockResolvedValueOnce(null)
    await request(app)
      .put(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send(categoryUpdate)
      .expect(500)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Error al editar la categoría.')
      })
  })
  it('should return error 500 when a server error occurred message should be "Error interno del servidor"', async () => {
    const category = await Category.find()
    const idString = category[1]._id.toString()
    const urlWithId = url + idString
    vi.spyOn(Category.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('Simulated internal server error')
    })
    await request(app)
      .put(urlWithId)
      .set('Authorization', `Bearer ${token}`)
      .send(categoryUpdate)
      .expect(500)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Error interno del servidor.')
      })
  })
})
