import { Request, Response } from 'express'
import 'dotenv/config.js'
import { sendResponse } from '../../utils/response'
import { Category } from '../../models/category'
import { ICategory } from '../../types'
import User from '../../models/user'

export const postCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, iconName, isDefault }: ICategory = req.body
    const { role, name: userName } = JSON.parse(req.params.token)
    const isAdmin = role === 'admin'

    const categoryName = name?.trim()
    const categoryIconName = iconName?.trim()
    const invalidContent =
      categoryName === undefined ||
      categoryName.length === 0 ||
      categoryIconName === undefined ||
      categoryIconName.length === 0

    if (invalidContent) {
      return sendResponse(res, 400, {
        error: 'Nombre de categoría, icono y usuario son requeridos.'
      })
    }
    const user = await User.findOne({ username: userName })
    if (user === null) {
      return sendResponse(res, 404, {
        error: 'El usuario no existe.'
      })
    }

    if (!isAdmin && isDefault) {
      return sendResponse(res, 403, {
        error: 'No tienes permisos para crear una categoría predeterminada.'
      })
    }

    const newCategory = new Category({
      name: categoryName,
      iconName: categoryIconName,
      user: user._id,
      isDefault: isDefault || false
    })

    const categoryCreated = await newCategory.save()
    const categoryToSend = await Category.findOne({
      _id: categoryCreated._id,
      user: user._id
    }).populate('user', 'username')
    return sendResponse(res, 200, {
      data: categoryToSend,
      message: `Categoría creada con éxito ${categoryCreated.name}.`
    })
  } catch (error: any) {
    if (error.code === 11000) {
      return sendResponse(res, 400, {
        error: 'La categoría ya existe.'
      })
    }
    sendResponse(res, 500, {
      error: 'Error interno del servidor.'
    })
  }
}
