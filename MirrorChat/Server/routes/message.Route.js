import express from 'express'
import { analyzeImageController, generateNotesController, imageMessageController, textMessageController } from '../controller/mesage.Controller.js'
import { getUserData } from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
import { uploadImage } from '../middlewares/uploadImage.js'
const messageRouter = express.Router()

messageRouter.post('/text',getUserData,  textMessageController)
messageRouter.post('/image',getUserData,imageMessageController)
messageRouter.post('/notes-gen',getUserData,upload.single('document'),generateNotesController)
messageRouter.post('/analyze-image',getUserData,uploadImage.single('image'),analyzeImageController)

export default messageRouter