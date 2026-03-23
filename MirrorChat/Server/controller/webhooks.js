import Stripe from "stripe";
import Traction from "../models/traction.js";
import User from "../models/user.js";

// Webhook handler for Stripe events related to payments and subscriptions

export const stripeWebbhooks = async (req, res) => {
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { transactionId, appId } = session.metadata || {};
       

        if (appId !== "MirrorChat") {
          return res.json({ received: true, message: "Ignored event: Invalid appId" });
        }

        if (!transactionId) {
          return res.json({ received: true, message: "No transactionId in session metadata" });
        }

        const transaction = await Traction.findOne({
          _id: transactionId,
          isPaid: false,
        });

        if (!transaction) {
          
          return res.json({ received: true, message: "No pending transaction found" });
        }

        const updateResult = await User.updateOne(
          { _id: transaction.userId },
          { $inc: { credits: transaction.credits } },
        );
      

        transaction.isPaid = true;
        await transaction.save();
        

        break;
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        })
        const session = sessionList.data[0];
        if(!session){
          return res.json({ received: true, message:"No session found for this payment intent" });
        }
        const { transactionId, appId } = session.metadata
       
        if (appId === "MirrorChat") {
          const transaction = await Traction.findOne({
          _id: transactionId,
          isPaid: false,
        });

        if (!transaction) {
          return res.json({ received: true, message: "No pending transaction found" });
        }

        const updateResult = await User.updateOne(
          { _id: transaction.userId },
          { $inc: { credits: transaction.credits } },
        );

transaction.isPaid = true;
        await transaction.save();
        
        
        } else{
          return res.json({ received: true, message:"Ignored event:Invalid appId" });
        }break;

      }
      
      

      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }
    res.json({ received: true });
  } catch (error) {
    return res.status(500).send(`Internal server error: ${error.message}`);
  }
};
