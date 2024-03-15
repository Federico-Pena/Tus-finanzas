import { Router } from 'express'
import { ROUTES } from '../constants'
import { login } from '../controllers/user/login'
import { register } from '../controllers/user/register'
import { deleteAccount } from '../controllers/user/deleteAccount'
import { postTokenPushNotification } from '../controllers/user/postTokenPushNotification'
import authMiddleware from '../middleware/authorization'

export const userRoutes = Router()

userRoutes.post(ROUTES.USER.loginUser, login)
userRoutes.post(ROUTES.USER.registerUser, register)
userRoutes.delete(ROUTES.USER.deleteUserAccount, deleteAccount)
userRoutes.post(ROUTES.USER.postPushNotificationToken, authMiddleware, postTokenPushNotification)
