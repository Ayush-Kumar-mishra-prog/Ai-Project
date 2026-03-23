import express from 'express'
import { analyzeImageController, imageMessageController, textMessageController } from '../controller/mesage.Controller.js'
import { getUserData } from '../middlewares/auth.js'
import { uploadImage } from '../middlewares/uploadImage.js'
const messageRouter = express.Router()

messageRouter.post('/text',getUserData,  textMessageController)
messageRouter.post('/image',getUserData,imageMessageController)
messageRouter.post('/analyze-image',getUserData,uploadImage.single('image'),analyzeImageController)

export default messageRouter
