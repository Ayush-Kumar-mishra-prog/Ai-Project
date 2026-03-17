import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chat.Routes.js';
import messageRouter from './routes/message.Route.js';
import paymentRouter from './routes/payments.Route.js';
import { stripeWebbhooks } from './controller/webhooks.js';

dotenv.config();

const app = express();

app.use(cors());
// stripe webhooks route (must be before express.json for signature verification)
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebbhooks);

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
await connectDB()

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/payment', paymentRouter )



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
