import express from 'express'
import { generateNotesController, imageMessageController, textMessageController } from '../controller/mesage.Controller.js'
import { getUserData } from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'
const messageRouter = express.Router()

messageRouter.post('/text',getUserData,  textMessageController)
messageRouter.post('/image',getUserData, getUserData,imageMessageController)
messageRouter.post('/notes-gen',getUserData,upload.single('document'),generateNotesController)

export default messageRouter