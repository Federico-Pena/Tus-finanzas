import { Response, Request } from 'express'
import { sendResponse } from '../../utils/response'
import User from '../../models/user'
import { Transaction } from '../../models/transaction'
import { Category } from '../../models/category'

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.params.username
    const name = username.trim()

    const userForDelete = await User.findOne({ username: name })

    if (userForDelete === null) {
      return sendResponse(res, 404, { error: 'El usuario no existe.' })
    }

    const user = await User.findByIdAndDelete(userForDelete._id)

    if (user === null) {
      return sendResponse(res, 500, { error: 'Error al eliminar el usuario.' })
    }
    await Transaction.deleteMany({
      user: userForDelete._id
    })
    await Category.deleteMany({
      user: userForDelete._id
    })
    return sendResponse(res, 200, {
      message: 'Usuario eliminado con éxito.'
    })
  } catch (e: any) {
    sendResponse(res, 500, { error: 'Error interno del servidor.' })
  }
}
