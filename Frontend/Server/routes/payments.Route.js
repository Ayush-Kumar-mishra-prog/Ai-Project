import express from 'express'
import { createOrder, getPlans, purchasePlans, verifyPayment } from '../controller/credit.Controller.js';
import { getUserData } from '../middlewares/auth.js';

const paymentRouter = express.Router()


paymentRouter.post("/purchase",getUserData, purchasePlans);
paymentRouter.get("/getPlans",getPlans)


export default paymentRouter