import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { NextFunction, Request, Response } from 'express'
import { sendResponse } from '../utils/response'
const secretKey = process.env.JWT_SECRET ?? ''

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split('Bearer ')[1] as string
  const invalidRequest = token === undefined || token.trim().length === 0
  if (invalidRequest) {
    return sendResponse(res, 401, {
      error: 'No hay token, autorización denegada.'
    })
  }

  try {
    const decoded = jwt.verify(token, secretKey)
    req.params.token = JSON.stringify(decoded)
    next()
  } catch (error) {
    return sendResponse(res, 401, {
      error: 'Su sesión expiró, inicie sesión nuevamente.'
    })
  }
}

export default authMiddleware
