import express from 'express'
import { imageMessageController, textMessageController } from '../controller/mesage.Controller.js'
import { getUserData } from '../middlewares/auth.js'
const messageRouter = express.Router()

messageRouter.post('/text',getUserData,  textMessageController)
messageRouter.post('/image',getUserData, getUserData,imageMessageController)

export default messageRouter