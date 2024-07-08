import asyncerrorhandler from '../Common/Asyncerrorhandler.js';
import stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeInstance = stripe(process.env.stripe_sckey);

const processPayment = asyncerrorhandler(async (req, res, next) => {
    try {
        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: req.body.amount,
            currency: "usd",
            description: "TEST PAYMENT",
            metadata: { integration_check: "accept_payment" },
            shipping: req.body.shipping
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret
        });
    } catch (error) {
        // Handle errors here
        next(error);
    }
});

const sendStripeApi = asyncerrorhandler(async (req, res, next) => {
    try {
        res.status(200).json({
            stripeApiKey: process.env.stripe_key
        });
    } catch (error) {
        // Handle errors here
        next(error);
    }
});

export default {
    processPayment,
    sendStripeApi
}
