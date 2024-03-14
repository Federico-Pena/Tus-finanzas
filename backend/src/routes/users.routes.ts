import { Router } from 'express'
import { RUTES } from '../constants'
import { login } from '../controllers/user/login'
import { register } from '../controllers/user/register'
import { deleteAccount } from '../controllers/user/deleteAccount'
import { postTokenPushNotification } from '../controllers/user/postTokenPushNotification'
import authMiddleware from '../middleware/authorization'

export const userRoutes = Router()

userRoutes.post(RUTES.USER.loginUser, login)
userRoutes.post(RUTES.USER.registerUser, register)
userRoutes.delete(RUTES.USER.deleteUserAccount, deleteAccount)
userRoutes.post(RUTES.USER.postPushNotificationToken, authMiddleware, postTokenPushNotification)
