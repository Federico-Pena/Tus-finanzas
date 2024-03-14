import { Request, Response } from 'express'
import 'dotenv/config.js'
import { Category } from '../../models/category'
import { sendResponse } from '../../utils/response'
import User from '../../models/user'
import { Document, Types } from 'mongoose'

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, name } = JSON.parse(req.params.token)
    const isAdmin = role === 'admin'

    if (!isAdmin) {
      const user = await User.findOne({ username: name })
      if (user === null) {
        return sendResponse(res, 404, { error: 'Usuario no encontrado.' })
      }
      const categories = await findUserOrDefaultCategories(user._id)
      return categories.length > 0
        ? sendResponse(res, 200, { data: categories })
        : sendResponse(res, 404, { error: 'No se encontraron categorías.' })
    }
    const categories = await Category.find().sort({ name: 1 }).populate('user', 'username')
    if (categories.length === 0) {
      return sendResponse(res, 404, { error: 'No se encontraron categorías.' })
    }
    sendResponse(res, 200, { data: categories })
  } catch (e: any) {
    sendResponse(res, 500, { error: 'Error interno del servidor.' })
  }
}

const findUserOrDefaultCategories = async (userId: Types.ObjectId): Promise<Document[]> => {
  return await Category.find({
    $or: [{ user: userId }, { isDefault: true }]
  })
    .sort({ name: 1 })
    .populate('user', 'username')
}
