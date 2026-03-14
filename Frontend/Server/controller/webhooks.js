import Stripe from 'stripe';
import Traction from '../models/traction.js';
import User from '../models/user.js';

export const stripeWebbhooks = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    let event;  

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
       return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':{
                const paymentIntent = event.data.object;
                const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                })
                const session = sessionList.data[0]
                const {transactionId, appId} = session.metadata;
                if(appId == 'MirrorChat'){
                   const transaction = await Traction.findOne({_id:transactionId, isPaid:false});

                   // update credits and transaction status

                   await User.updateOne({_id:transaction.userId}, {$inc:{credits:transaction.credits}})

                   // update payment status

                   transaction.isPaid = true
                   await transaction.save()
                }
                else{
                    return res.status(400).send('Invalid appId');
                }
                break;
            }
                // Handle successful payment intent
                
        
            default:
                console.log(`Unhandled event type ${event.type}`);
                break;
        }
        res.json({ received: true });
    } catch (error) {
        return res.status(500).send(`Internal server error: ${error.message}`);
    }
}