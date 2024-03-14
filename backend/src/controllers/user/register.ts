import { hash } from 'bcrypt'
import { Response, Request } from 'express'
import { sendResponse } from '../../utils/response'
import User from '../../models/user'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body
    const name = username.trim()
    const userEmail = email.trim()
    const userPassword = password.trim()

    if (name.length < 3 || name.length > 12) {
      return sendResponse(res, 400, {
        error: 'El nombre de usuario debe tener entre 3 y 12 caracteres.'
      })
    }

    if (!isValidEmail(userEmail)) {
      return sendResponse(res, 400, { error: 'El formato del correo electrónico es inválido.' })
    }

    if (!isValidPassword(userPassword)) {
      return sendResponse(res, 400, {
        error:
          'La contraseña debe tener entre 8 y 12 caracteres y contener al menos una letra mayúscula, una letra minúscula y un número.'
      })
    }

    const saltRounds = 10
    const hashedPassword = await hash(userPassword, saltRounds)

    const newUser = new User({
      username: name,
      email: userEmail,
      password: hashedPassword
    })

    await newUser.save()

    return sendResponse(res, 200, {
      message: 'Usuario registrado exitosamente, ahora inicie sesión.'
    })
  } catch (error: any) {
    if (error.code === 11000) {
      return sendResponse(res, 400, {
        error: 'El nombre de usuario o email esta asociado a otra cuenta.'
      })
    }
    sendResponse(res, 500, { error: 'Error interno del servidor.' })
  }
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/
  return passwordRegex.test(password.trim())
}
