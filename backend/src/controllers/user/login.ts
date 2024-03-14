import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config.js'
import { Response, Request } from 'express'
import { sendResponse } from '../../utils/response'
import User from '../../models/user'

const secretKey = process.env.JWT_SECRET as string
const adminUserIds = process.env.ADMIN_USER_IDS ?? ''
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body
    const userToFind = usernameOrEmail.trim()
    const user = await User.findOne({
      $or: [{ username: userToFind }, { email: userToFind }]
    })
    if (user === null) {
      return sendResponse(res, 400, { error: 'Credenciales incorrectas.' })
    }
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return sendResponse(res, 400, { error: 'Credenciales incorrectas.' })
    }
    const isAdmin = adminUserIds.includes(user._id.toString())
    let token
    let role
    if (isAdmin) {
      token = jwt.sign({ name: user.username, role: 'admin' }, secretKey, {
        expiresIn: '7h'
      })
      role = 'admin'
    } else {
      token = jwt.sign({ name: user.username, role: 'user' }, secretKey, {
        expiresIn: '7h'
      })
      role = 'user'
    }

    return sendResponse(res, 200, {
      data: { token, user: { name: user.username, role } },
      message: `Hola otra vez ${user.username}`
    })
  } catch (e: any) {
    sendResponse(res, 500, { error: 'Error interno del servidor.' })
  }
}
