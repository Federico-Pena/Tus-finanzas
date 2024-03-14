import { Response } from 'express'
import { ResponseOptions } from '../types'

export const sendResponse = (
  res: Response,
  statusCode: number,
  { data, message, error }: ResponseOptions
): void => {
  const payload: any = {}

  if (data !== undefined) {
    payload.data = data
  }
  if (message !== undefined) {
    payload.message = message
  }
  if (error !== undefined) {
    payload.error = error
  }
  payload.status = statusCode
  res.status(statusCode).json(payload)
}
