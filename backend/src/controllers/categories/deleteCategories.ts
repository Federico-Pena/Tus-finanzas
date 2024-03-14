import { Request, Response } from 'express'
import 'dotenv/config.js'
import { sendResponse } from '../../utils/response'
import { Category } from '../../models/category'
import User from '../../models/user'
import { Transaction } from '../../models/transaction'

export const deleteCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = req.params.id
    const { role, name } = JSON.parse(req.params.token)
    const isAdmin = role === 'admin'

    const user = await User.findOne({ username: name })

    if (user === null) {
      return sendResponse(res, 404, {
        error: 'El usuario no existe.'
      })
    }

    const category = await Category.findOne({ _id: categoryId, user: user._id })

    if (category === null) {
      return sendResponse(res, 404, {
        error: 'Categoría no encontrada, no pertenece al usuario.'
      })
    }

    if (!isAdmin && category.isDefault) {
      return sendResponse(res, 403, {
        error: 'No tienes permisos para eliminar esta esta categoría.'
      })
    }

    const categoryDeleted = await Category.findByIdAndDelete(categoryId)

    await Transaction.deleteMany({ category: categoryId, user: user._id })
    if (categoryDeleted !== null) {
      return sendResponse(res, 200, {
        data: categoryDeleted,
        message: 'Categoría borrada con éxito.'
      })
    } else {
      sendResponse(res, 500, {
        error: 'Error al borrar la categoría.'
      })
    }
  } catch (error) {
    sendResponse(res, 500, {
      error: 'Error interno del servidor.'
    })
  }
}
