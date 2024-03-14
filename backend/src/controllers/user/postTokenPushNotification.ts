import { Request, Response } from 'express'
import { sendResponse } from '../../utils/response'
import User from '../../models/user'

export const postTokenPushNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = JSON.parse(req.params.token)
    const { token } = req.body
    const user = await User.findOne({ username: name })
    if (user === null) {
      return sendResponse(res, 404, { error: 'El usuario no existe.' })
    }
    await User.findByIdAndUpdate(user._id, { pushToken: token })
    sendResponse(res, 200, {})
  } catch (error) {
    sendResponse(res, 500, {
      error: 'Error interno del servidor.'
    })
  }
}
