import express from 'express'

import { getUserData } from '../middlewares/auth.js'
import { getUser, login, register } from '../controller/userController.js'
import { getPublishedImages } from '../controller/mesage.Controller.js'
const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/data',getUserData,getUser)
userRouter.get('/published-images', getPublishedImages)

export default userRouter