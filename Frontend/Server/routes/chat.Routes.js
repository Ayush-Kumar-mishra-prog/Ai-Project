import express from 'express'
import { createChat, deleteChat, getChat } from '../controller/chat.conroller.js'
import { textMessageController } from '../controller/mesage.Controller.js'
import { getUserData } from '../middlewares/auth.js'
const chatRouter = express.Router()

 chatRouter.get('/create', getUserData, createChat)
 chatRouter.get('/get', getUserData, getChat)
 chatRouter.post('/delete', getUserData, deleteChat)
 

export default   chatRouter