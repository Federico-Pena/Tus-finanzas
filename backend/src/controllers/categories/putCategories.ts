import { Request, Response } from 'express'
import 'dotenv/config.js'
import { sendResponse } from '../../utils/response'
import { ICategory } from '../../types'
import { Category } from '../../models/category'
import User from '../../models/user'

export const putCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = req.params.id
    const { role, name: userName } = JSON.parse(req.params.token)
    const isAdmin = role === 'admin'
    const { name, iconName, isDefault }: ICategory = req.body
    const categoryName = name?.trim()
    const categoryIconName = iconName?.trim()
    const invalidContent =
      categoryName === undefined ||
      categoryName.length === 0 ||
      categoryIconName === undefined ||
      categoryIconName.length === 0

    if (invalidContent) {
      return sendResponse(res, 400, {
        error: 'Nombre de categoría e icono son requeridos.'
      })
    }
    const user = await User.findOne({ username: userName })
    if (user === null) {
      return sendResponse(res, 404, {
        error: 'El usuario no existe.'
      })
    }
    const categoryToUpdate = await Category.findOne({
      _id: categoryId,
      user: user._id
    })

    if (categoryToUpdate === null) {
      return sendResponse(res, 404, {
        error: 'Categoría no encontrada, no pertenece al usuario.'
      })
    }

    if (!isAdmin && isDefault) {
      return sendResponse(res, 403, {
        error: 'No tienes permisos para editar esta categoría.'
      })
    }

    categoryToUpdate.name = name ?? categoryToUpdate.name
    categoryToUpdate.iconName = iconName ?? categoryToUpdate.iconName
    categoryToUpdate.isDefault = isDefault ?? categoryToUpdate.isDefault

    const updatedCategory = await categoryToUpdate.save()

    if (updatedCategory !== null) {
      const categoryToSend = await Category.findOne({
        _id: updatedCategory._id,
        user: user._id
      }).populate('user', 'username')
      sendResponse(res, 200, {
        data: categoryToSend,
        message: `Categoría actualizada con éxito ${updatedCategory.name}.`
      })
    } else {
      sendResponse(res, 500, {
        error: 'Error al editar la categoría.'
      })
    }
  } catch (error: any) {
    if (error.code === 11000) {
      return sendResponse(res, 400, {
        error: 'Esta categoría ya existe.'
      })
    }
    sendResponse(res, 500, {
      error: 'Error interno del servidor.'
    })
  }
}
