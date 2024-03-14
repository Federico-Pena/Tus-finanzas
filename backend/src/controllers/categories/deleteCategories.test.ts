import express, { Application } from 'express'
import { RUTES } from '../../constants'
import { deleteCategories } from './deleteCategories'
import request from 'supertest'
import { dbTestConnect, dbTestDisconnect } from '../../databaseTest'
import { Category } from '../../models/category'
import User from '../../models/user'
import { generateValidToken, mockCategories } from '../testConst'
import authMiddleware from '../../middleware/authorization'

let app: Application
let token: string
beforeAll(async () => {
  app = express()
  app.use(express.json())
  app.delete(RUTES.CATEGORIES.deleteCategories, authMiddleware, deleteCategories)
  await dbTestConnect()
  const user = new User({
    username: 'Usuario de Prueba',
    email: 'EmailDePrueba@gmail.com',
    password: 'passwordDePrueba'
  })
  const newUser = await user.save()
  mockCategories[1].user = newUser._id
  token = generateValidToken(newUser.username, 'user')
  app.set('Authorization', `Bearer ${token}`)
  await Category.insertMany(mockCategories)
})
afterAll(async () => {
  await dbTestDisconnect()
})
describe('deleteCategories controller', () => {
  it('should return error 500 when findByIdAndDelete fail message should be "Error al borrar la categoría"', async () => {
    const categories = await Category.find()
    const categoryIdToDelete = categories[1]._id.toString()
    const url = `${RUTES.CATEGORIES.deleteCategories.replace(':id', categoryIdToDelete)}`
    vi.spyOn(Category, 'findByIdAndDelete').mockResolvedValueOnce(null)
    await request(app)
      .delete(url)
      .set('Authorization', `Bearer ${token}`)
      .expect(500)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('Error al borrar la categoría.')
      })
  })
  it('should return error 404 when user not found message should be "El usuario no existe."', async () => {
    const categories = await Category.find()
    const categoryIdToDelete = categories[1]._id.toString()
    const userName = 'PepeExample'
    const url = `${RUTES.CATEGORIES.deleteCategories.replace(':id', categoryIdToDelete)}`
    const falseToken = generateValidToken(userName, 'user')
    await request(app)
      .delete(url)
      .set('Authorization', `Bearer ${falseToken}`)
      .expect(404)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('El usuario no existe.')
      })
  })
  it('should return error 404 when category is default or does not belong to the user message should be "Categoría no encontrada, no pertenece al usuario o no puede eliminarla."', async () => {
    const categories = await Category.find()
    const categoryIdToDelete = categories[0]._id.toString()
    const url = `${RUTES.CATEGORIES.deleteCategories.replace(':id', categoryIdToDelete)}`
    await request(app)
      .delete(url)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then((response) => {
        const { error } = response.body
        expect(error).toBe('Categoría no encontrada, no pertenece al usuario.')
      })
  })
  it('should return error 403 when category default delete  fails, only admin users can edit default categories', async () => {
    const category = await Category.find()
    const user = await User.find()
    const idUser: string = user[0]._id.toString()
    category[0].user = idUser
    const newCategory = await category[0].save()
    const idString = newCategory._id.toString()
    const url = `${RUTES.CATEGORIES.deleteCategories.replace(':id', idString)}`
    await request(app)
      .delete(url)
      .expect(403)
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('No tienes permisos para eliminar esta esta categoría.')
      })
  })
  it('should return error 500 when a server error occurred message should be "Error interno del servidor"', async () => {
    const categories = await Category.find()
    const categoryIdToDelete = categories[1]._id.toString()
    const url = `${RUTES.CATEGORIES.deleteCategories.replace(':id', categoryIdToDelete)}`

    vi.spyOn(Category, 'findByIdAndDelete').mockImplementationOnce(() => {
      throw new Error('Simulated internal server error')
    })
    await request(app)
      .delete(url)
      .set('Authorization', `Bearer ${token}`)
      .expect(500)
      .then((res) => {
        const { error } = res.body
        expect(error).toBe('Error interno del servidor.')
      })
  })
  it('should delete a category when id in request is correct', async () => {
    const categories = await Category.find()
    const categoryIdToDelete = categories[1]._id.toString()
    const url = `${RUTES.CATEGORIES.deleteCategories.replace(':id', categoryIdToDelete)}`

    await request(app)
      .delete(url)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        const { data, message } = res.body
        expect(data).toMatchObject(mockCategories[1])
        expect(message).toBe('Categoría borrada con éxito.')
      })
  })
})
